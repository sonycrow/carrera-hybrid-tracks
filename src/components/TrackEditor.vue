<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import html2canvas from 'html2canvas';

const { t } = useI18n();

const getImageUrl = (name) => {
  return new URL(`/src/assets/sections/${name}.png`, import.meta.url).href;
};

const sections = ref([
  { name: t('trackSection.start'), path: getImageUrl('start') },
  { name: t('trackSection.straight'), path: getImageUrl('straight') },
  { name: t('trackSection.narrow'), path: getImageUrl('narrow') },
  { name: t('trackSection.curve-left'), path: getImageUrl('curve-left') },
  { name: t('trackSection.curve-right'), path: getImageUrl('curve-right') },
]);

const inventory = ref({});

const numCols = ref(15);
const numRows = ref(11);
const circuit = ref([]);
const showGrid = ref(true);

watch([numCols, numRows], () => {
  circuit.value = new Array(numCols.value * numRows.value).fill(null);
});

const circuitRows = computed(() => {
  const rows = [];
  for (let i = 0; i < numRows.value; i++) {
    const row = [];
    for (let j = 0; j < numCols.value; j++) {
      const index = i * numCols.value + j;
      row.push({ cell: circuit.value[index], index });
    }
    rows.push(row);
  }
  return rows;
});

const usedSectionsCount = computed(() => {
  return circuit.value.filter(cell => cell !== null).length;
});

const trackLength = computed(() => {
  const pieceLengthCm = 44;
  const totalLengthCm = usedSectionsCount.value * pieceLengthCm;
  return (totalLengthCm / 100).toFixed(2);
});

const sectionCounts = computed(() => {
  const counts = {};
  for (const cell of circuit.value) {
    if (cell) {
      counts[cell.name] = (counts[cell.name] || 0) + 1;
    }
  }
  return counts;
});

const availableSections = computed(() => {
  const available = {};
  for (const section of sections.value) {
    const inventoryCount = inventory.value[section.name] || 0;
    const usedCount = sectionCounts.value[section.name] || 0;
    available[section.name] = inventoryCount - usedCount;
  }
  return available;
});


let draggedSection = null;
let draggedFromIndex = null;

const onDragStart = (section) => {
  draggedSection = section;
  draggedFromIndex = null;
};

const onGridDragStart = (index, cell) => {
  draggedSection = cell;
  draggedFromIndex = index;
};

const onDrop = (toIndex) => {
  if (!draggedSection) return;

  if (draggedFromIndex === toIndex) {
    draggedSection = null;
    draggedFromIndex = null;
    return;
  }

  if (draggedFromIndex === null) { // Dragging from sidebar
    if (availableSections.value[draggedSection.name] <= 0) {
      draggedSection = null;
      return;
    }
  }

  const newCell = { ...draggedSection };
  if (!('rotation' in newCell)) {
    newCell.rotation = 0;
  }

  circuit.value[toIndex] = newCell;

  if (draggedFromIndex !== null) {
    circuit.value[draggedFromIndex] = null;
  }

  draggedSection = null;
  draggedFromIndex = null;
};

const rotateSection = (index) => {
  if (circuit.value[index]) {
    circuit.value[index].rotation = (circuit.value[index].rotation + 60) % 360;
  }
};

const deleteSection = (index) => {
  circuit.value[index] = null;
};

const exportToPNG = async () => {
  const gridContainer = document.querySelector('.hex-grid-container');
  if (!gridContainer) return;

  const originalShowGrid = showGrid.value;
  showGrid.value = false;

  await nextTick();

  const cells = gridContainer.querySelectorAll('.hexagon');
  let minX = Infinity, minY = Infinity, maxX = 0, maxY = 0;

  cells.forEach(cell => {
    if (cell.querySelector('img')) {
      const rect = cell.getBoundingClientRect();
      minX = Math.min(minX, rect.left);
      minY = Math.min(minY, rect.top);
      maxX = Math.max(maxX, rect.right);
      maxY = Math.max(maxY, rect.bottom);
    }
  });

  const width = maxX - minX;
  const height = maxY - minY;

  html2canvas(gridContainer, {
    backgroundColor: null,
    x: minX - gridContainer.getBoundingClientRect().left,
    y: minY - gridContainer.getBoundingClientRect().top,
    width: width,
    height: height,
  }).then(canvas => {
    const link = document.createElement('a');
    link.download = 'circuit-design.png';
    link.href = canvas.toDataURL('image/png');
    link.click();

    showGrid.value = originalShowGrid;
  });
};

const copyUrl = () => {
  navigator.clipboard.writeText(window.location.href)
    .then(() => {
      alert($t('trackEditor.urlCopied'));
      console.log($t('trackEditor.urlCopied'));
    })
    .catch(err => {
      alert($t('trackEditor.urlCopiedError'));
      console.error($t('trackEditor.urlCopiedError'), err);
    });
};

// === Shareable URL Logic ===
const route = useRoute();
const router = useRouter();

watch([circuit, inventory, numCols, numRows], ([newCircuit, newInventory, newNumCols, newNumRows]) => {
  const simplifiedCircuit = newCircuit.map(cell => {
    if (!cell) return null;
    return { name: cell.name, rotation: cell.rotation };
  });
  const circuitJson = JSON.stringify(simplifiedCircuit);
  const circuitBase64 = btoa(circuitJson);

  const inventoryJson = JSON.stringify(newInventory);
  const inventoryBase64 = btoa(inventoryJson);

  const query = {
    cols: newNumCols,
    rows: newNumRows,
  };
  if (circuitBase64) query.circuit = circuitBase64;
  if (inventoryBase64) query.inventory = inventoryBase64;

  if (query.circuit !== route.query.circuit || query.inventory !== route.query.inventory || query.cols !== route.query.cols || query.rows !== route.query.rows) {
    router.push({ query });
  }
}, { deep: true });

onMounted(() => {
  const cols = route.query.cols ? parseInt(route.query.cols, 10) : 15;
  const rows = route.query.rows ? parseInt(route.query.rows, 10) : 11;
  numCols.value = cols;
  numRows.value = rows;
  circuit.value = new Array(cols * rows).fill(null);

  sections.value.forEach(s => {
    if (!inventory.value[s.name]) {
      inventory.value[s.name] = 0;
    }
  });

  const inventoryData = route.query.inventory;
  if (inventoryData) {
    try {
      const jsonString = atob(inventoryData);
      Object.assign(inventory.value, JSON.parse(jsonString));
    } catch (e) {
      console.error($t('trackEditor.loadInventoryError'), e);
    }
  }

  const circuitData = route.query.circuit;
  if (circuitData) {
    try {
      const jsonString = atob(circuitData);
      const simplifiedCircuit = JSON.parse(jsonString);

      const newCircuit = simplifiedCircuit.map(cellData => {
        if (!cellData) return null;
        const sectionInfo = sections.value.find(s => s.name === cellData.name);
        if (!sectionInfo) return null;
        return {
          ...sectionInfo,
          rotation: cellData.rotation,
        };
      });
      circuit.value = newCircuit;
    } catch (e) {
      console.error($t('trackEditor.loadCircuitError'), e);
      router.push({ query: {} });
    }
  }
});

</script>

<template>
  <div class="flex h-screen">
    <div class="w-1/4 pt-4 pr-4 overflow-y-auto">
      <h2 class="text-lg font-bold mb-2">{{ $t('trackEditor.sections') }}</h2>
      <div class="grid grid-cols-2 gap-2">
        <div
          v-for="section in sections"
          :key="section.name"
          class="p-2 border rounded"
          :class="{ 
            'cursor-not-allowed': availableSections[section.name] <= 0,
            'cursor-grab': availableSections[section.name] > 0
          }"
          :draggable="availableSections[section.name] > 0"
          @dragstart="onDragStart(section)"
        >
          <div :class="{ 'opacity-50': availableSections[section.name] <= 0 }">
            <img :src="section.path" :alt="section.name" class="h-20 mx-auto" />
            <p class="text-center text-sm">{{ section.name }}</p>
          </div>
          
          <div class="flex items-center justify-center mt-2 text-xs">
            <div class="flex items-center">
              <span class="mr-1">{{ $t('trackEditor.total') }}</span>
              <input type="number" min="0" v-model.number="inventory[section.name]" @click.stop class="w-11 p-1 border rounded text-sm">
            </div>
            <div>
              <span class="font-bold pl-2">{{ $t('trackEditor.availableSections') }} {{ availableSections[section.name] }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-8 p-4 border rounded bg-gray-50">
        <h3 class="text-md font-bold mb-2">{{ $t('trackEditor.controlsSections') }}</h3>
        <ul class="list-disc list-inside text-sm space-y-1">
          <li><strong>{{ $t('trackEditor.dragDropSections') }}</strong> {{ $t('trackEditor.dragDropSectionsAction') }}</li>
          <li><strong>{{ $t('trackEditor.rightClickSections') }}</strong> {{ $t('trackEditor.rightClickSectionsAction') }}</li>
          <li><strong>{{ $t('trackEditor.doubleClickSections') }}</strong> {{ $t('trackEditor.doubleClickSectionsAction') }}</li>
        </ul>
      </div>

    </div>
    <div
      class="w-3/4 pt-4 pl-4 border-l flex flex-col"
      @dragover.prevent
    >
      <div class="flex justify-between items-center mb-4 shrink-0">
        <div class="flex items-center gap-2">
          <span class="text-sm">{{ $t('trackEditor.columns') }}</span>
          <input type="number" min="1" v-model.number="numCols" class="w-16 p-1 border rounded text-sm">
          <span class_="text-sm">{{ $t('trackEditor.rows') }}</span>
          <input type="number" min="1" v-model.number="numRows" class="w-16 p-1 border rounded text-sm">
          <label for="showGrid" class="text-sm">{{ $t('trackEditor.showGrid') }}</label>
          <input type="checkbox" id="showGrid" v-model="showGrid" class="w-4 h-4">
        </div>
        <div class="flex items-center gap-4">
          <div class="text-lg">
            {{ $t('trackEditor.total') }} <strong>{{ usedSectionsCount }}</strong>
          </div>
          <div class="text-lg">
            {{ $t('trackEditor.length') }} <strong>{{ trackLength }} m</strong>
          </div>
          <div class="flex flex-wrap gap-2 text-xs">
              <div v-for="(count, name) in sectionCounts" :key="name" class="p-1 border rounded bg-gray-100">
                {{ name }}: <strong>{{ count }}</strong>
              </div>
          </div>
          <button @click="copyUrl" class="p-2 border rounded bg-blue-500 text-white text-sm">{{ $t('trackEditor.copyUrlButton') }}</button>
          <button @click="exportToPNG" class="p-2 border rounded bg-green-500 text-white text-sm">{{ $t('trackEditor.exportToPngButton') }}</button>
        </div>
      </div>
      <div class="flex-grow overflow-auto border rounded p-4">
        <div class="hex-grid-container">
          <div
            v-for="(row, rowIndex) in circuitRows"
            :key="rowIndex"
            class="hex-row"
            :class="{ odd: rowIndex % 2 !== 0 }"
          >
            <div
              v-for="({ cell, index }) in row"
              :key="index"
              class="hexagon"
              :class="{ 'no-grid': !showGrid }"
              :draggable="!!cell"
              @dragstart.stop="onGridDragStart(index, cell)"
              @dragover.prevent
              @drop="onDrop(index)"
              @contextmenu.prevent="rotateSection(index)"
              @dblclick="deleteSection(index)"
            >
              <img
                v-if="cell"
                :src="cell.path"
                :alt="cell.name"
                class="w-full h-full object-contain"
                :style="{ transform: `rotate(${cell.rotation}deg)` }"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hex-grid-container {
    --hex-width: 80px;
    --hex-height: calc(var(--hex-width) * 1.1547);
    --hex-margin: 0px;
    --row-shift: calc(var(--hex-width) / 2 + var(--hex-margin) / 2);

    display: flex;
    flex-direction: column;
    align-items: center;
}

.hex-row {
    display: flex;
    margin-bottom: calc(var(--hex-height) * -0.24 + var(--hex-margin));
}

.hex-row.odd {
    transform: translateX(var(--row-shift));
}

.hexagon {
    width: var(--hex-width);
    height: var(--hex-height);
    background-color: rgba(0,0,0,0.06);
    margin: calc(var(--hex-margin) / 2);
    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
    display: flex;
    justify-content: center;
    align-items: center;
    transition: background-color 0.3s ease;
    cursor: pointer;
    margin-right: 1px;
}

.hexagon:hover {
    background-color: #e0e0e0;
}

.hexagon.no-grid {
    background-color: transparent;
}

.hexagon img {
  pointer-events: none;
}
</style>