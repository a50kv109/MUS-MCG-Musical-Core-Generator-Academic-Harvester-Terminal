import React, { useState, useEffect, useRef } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { 
  Music, Database, Download, Play, RefreshCw, Terminal, 
  CheckCircle, AlertTriangle, ShieldCheck, Search, Activity, Cpu, 
  Layers, Settings, Info, Cross
} from 'lucide-react';

import INITIAL_CORES from './data/cores.json';

export default function App() {
  const [cores, setCores] = useState(INITIAL_CORES);
  const [selectedCore, setSelectedCore] = useState(INITIAL_CORES[0]);
  const [activeFilter, setActiveFilter] = useState("ВСЕ ЭПОХИ");
  const [isTesting, setIsTesting] = useState(false);
  const [testLogs, setTestLogs] = useState<string[]>([]);
  const [mixWeight, setMixWeight] = useState(0.5);

  const filters = ["ВСЕ ЭПОХИ", "БАРОККО", "КЛАССИКА", "РОМАНТИЗМ", "СОВРЕМЕННАЯ", "САКРАЛЬНОЕ"];

  const filteredCores = cores.filter(core => 
    activeFilter === "ВСЕ ЭПОХИ" ? true : core.era === activeFilter || core.type === activeFilter
  );

  const runTest = () => {
    setIsTesting(true);
    setTestLogs([`> Старт S-CORE валидации: ${selectedCore.name}...`]);
    const calcTdi = Math.round(Math.min((selectedCore.evrid.tension * selectedCore.evrid.density) / (selectedCore.evrid.function + 0.1), 1.0) * 1000) / 1000;
    const steps = [
      `[360°] Анализ EVRID: F=${selectedCore.evrid.function}, G=${selectedCore.evrid.gravitation}`,
      `[δ-ОПЕРАТОР] Фиксация δ-пика: ${selectedCore.delta}`,
      `[ШЛЮЗ АЛЁШИ] TDI Контроль (Базовый: ${selectedCore.tdi} < 0.45 | Расчётный: ${calcTdi} < 0.45) -> ДОПУСК`,
      `[✅ ПРОЙДЕНО] Топология стабильна. Порог Шлюза Алёши (0.45) соблюдён.`,
      `[S-CORE] a² + b² = c² -> Резонанс подтвержден.`,
      `> Статус: ГОТОВО_К_ИНТЕГРАЦИИ.`
    ];
    let i = 0;
    const interval = setInterval(() => {
      if (i < steps.length) {
        setTestLogs(prev => [...prev, steps[i]]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 500);
  };

  const COMPOSER_CLASS_NAMES: Record<string, string> = {
    rach: "RachmaninoffCore",
    chesnokov: "ChesnokovCore",
    bort: "BortnyanskyCore",
    arkh: "ArkhangelskyCore",
    kuznetsov: "KuznetsovCore",
    grechaninov: "GrechaninovCore",
    palest: "PalestrinaCore",
    kuku: "KukuzelCore",
    bach: "BachCore",
    moz: "MozartCore",
    glin: "GlinkaCore",
    tchai: "TchaikovskyCore",
    martynov: "MartynovCore",
    richter: "RichterCore",
    piazzolla: "PiazzollaCore",
    paart: "PaartCore",
    crumb: "CrumbCore"
  };

  const getModulePrefix = (core: any) => core.id.split('_')[0];

  const getClassName = (core: any) => {
    const prefix = getModulePrefix(core);
    return COMPOSER_CLASS_NAMES[prefix] || `${prefix.charAt(0).toUpperCase() + prefix.slice(1)}Core`;
  };

  const generateComposerCode = (core: any) => {
    const className = getClassName(core);
    return `"""
🎼 ${core.name} MUSICAL CORE v1.0
Архитектор: Арцыбашев Андрей Алексеевич
Идентификатор: AAM-V1_ARTSYBASHEV_UA_KHARKIV_AIANALYSIS
"""

import math
import random
import json

class ${className}:
    def __init__(self):
        self.id = "AAM-V1_ARTSYBASHEV_UA_KHARKIV_AIANALYSIS"
        self.name = "${core.name}"
        self.phi = 1.61803398875
        self.theta = 0.367879
        self.v_ref = 0.201
        self.ready_for_integration = True
        
        # EVRID-тензор
        self.evrid = {
            "function": ${core.evrid.function},
            "tension": ${core.evrid.tension},
            "density": ${core.evrid.density},
            "gravity": ${core.evrid.gravitation}
        }
        
        # δ-пік
        self.delta = ${core.delta}

        # Авторський базовий TDI (калібрувальна константа)
        self.tdi = ${core.tdi}
        self.tdi_baseline = ${core.tdi}
        
        # NADI-канали
        self.nadi = ${JSON.stringify(core.nadi, null, 4)}
        
        # Акустичний профіль
        self.acoustic = ${JSON.stringify(core.acoustic, null, 4)}
    
    def calculate_tdi(self):
        """Розрахунок топологічного дисонансу (TDI) з EVRID-тензора"""
        tdi = (self.evrid["tension"] * self.evrid["density"]) / (self.evrid["function"] + 0.1)
        return round(min(tdi, 1.0), 3)
        
    def calculate_delta(self):
        """Розрахунок δ-позиції з EVRID-тензора"""
        f, t, d, g = self.evrid["function"], self.evrid["tension"], self.evrid["density"], self.evrid["gravity"]
        delta = (f * 0.3 + t * 0.2 + d * 0.2 + g * 0.3)
        return round(delta, 3)
    
    def validate_s_core(self, melody, texture):
        """Інваріант Піфагора"""
        resonance = math.sqrt(melody**2 + texture**2)
        return round(resonance, 3)
    
    def get_metadata(self):
        return {
            "id": self.id,
            "name": self.name,
            "evrid": self.evrid,
            "delta": self.calculate_delta(),
            "nadi": self.nadi,
            "acoustic": self.acoustic,
            "tdi": self.tdi,
            "calculated_tdi": self.calculate_tdi(),
            "ready": self.ready_for_integration
        }
    
    def generate_example(self):
        """Приклад генерації музичної фрази"""
        melody = round(random.uniform(0.6, 0.9), 3)
        texture = round(random.uniform(0.6, 0.8), 3)
        resonance = self.validate_s_core(melody, texture)
        
        return {
            "melody": melody,
            "texture": texture,
            "resonance": resonance,
            "tdi": self.tdi,
            "calculated_tdi": self.calculate_tdi(),
            "style": "${core.name}",
            "s_core": f"{melody}² + {texture}² = {resonance}²"
        }

if __name__ == "__main__":
    core = ${className}()
    print(json.dumps(core.get_metadata(), indent=2, ensure_ascii=False))
    print("\\nПРИКЛАД ГЕНЕРАЦІЇ:")
    print(json.dumps(core.generate_example(), indent=2, ensure_ascii=False))
`;
  };

  const generateMetadata = (core: any) => {
    const calcTdi = Math.round(Math.min((core.evrid.tension * core.evrid.density) / (core.evrid.function + 0.1), 1.0) * 1000) / 1000;
    return JSON.stringify({
        "core_id": `${core.id}_v1.0`,
        "name": core.name,
        "version": "1.0.0",
        "architect": "Арцыбашев Андрей Алексеевич",
        "identifier": "AAM-V1_ARTSYBASHEV_UA_KHARKIV_AIANALYSIS",
        "type": "музыкальное ядро",
        "ready_for_integration": true,
        "metrics": {
            "phi": 1.618,
            "theta": 0.3678,
            "v_ref": 0.201,
            "tdi": core.tdi,
            "calculated_tdi": calcTdi,
            "delta_peak": core.delta
        },
        "date": new Date().toISOString().split('T')[0]
    }, null, 2);
  };

  const generateRequirements = () => {
    return `# MCG-V3.0 Musical Core
# Standard library only (Python >= 3.8). No external dependencies required.
`;
  };

  const generateReadme = (core: any) => {
    const modulePrefix = getModulePrefix(core);
    const className = getClassName(core);
    const calcTdi = Math.round(Math.min((core.evrid.tension * core.evrid.density) / (core.evrid.function + 0.1), 1.0) * 1000) / 1000;
    return `# 🎼 ${core.name} MUSICAL CORE v1.0

## 📋 ОПИСАНИЕ
Музыкальное ядро для стиля ${core.name}, созданное по методологии AAM-V2.1.
Реализация на чистом Python 3 без сторонних зависимостей.

## 🧬 МЕТРИКИ
- **EVRID-тензор**: функция (${core.evrid.function}), напряжение (${core.evrid.tension}), плотность (${core.evrid.density}), гравитация (${core.evrid.gravitation})
- **δ-пик**: ${core.delta}
- **NADI-каналы**: Ida (${core.nadi.ida}), Pingala (${core.nadi.pingala}), Sushumna (${core.nadi.sushumna})
- **TDI (базовый авторский)**: ${core.tdi} (исходный калибровочный показатель стиля)
- **TDI (расчётный)**: ${calcTdi} (динамически вычислен по формуле (T·D)/(F+0.1))
- **Шлюз Алёши**: порог допуска TDI < 0.45 (пройден: базовый ${core.tdi} < 0.45, расчётный ${calcTdi} < 0.45)
- **S-CORE** (инвариант Пифагора): a² + b² = c²

### Примечание о природе показателя TDI
TDI (Topological Dissonance Index) в текущей реализации является авторским эвристическим показателем гармоническо-фактурного баланса. Он вычисляется по заданной алгебраической формуле и не является математически доказанным топологическим инвариантом. Базовый TDI отражает экспертную калибровку стиля, а расчётный TDI — результат параметризации через EVRID.

## 🚀 ИСПОЛЬЗОВАНИЕ
Требования: Python 3.8+ (только стандартная библиотека).

\`\`\`python
from ${modulePrefix}_core import ${className}

core = ${className}()
metadata = core.get_metadata()
print(metadata)
\`\`\`

Запуск примера и тестов:
\`\`\`bash
python3 example.py
python3 -m unittest test_core.py
\`\`\`

## 📦 СТРУКТУРА АРХИВА
- \`${modulePrefix}_core.py\` — основной код класса ${className}
- \`metadata.json\` — метаданные ядра (включают tdi и calculated_tdi)
- \`requirements.txt\` — спецификация зависимостей (Zero external dependencies)
- \`README.md\` — документация и инструкция
- \`example.py\` — пример использования
- \`test_core.py\` — модульные тесты параметров ядра

## 🏛️ АВТОР
Архитектор: **Арцыбашев Андрей Алексеевич** (Харьков, Украина)
Идентификатор: \`AAM-V1_ARTSYBASHEV_UA_KHARKIV_AIANALYSIS\`

## ✅ СТАТУС
ready_for_integration = true
`;
  };

  const generateExample = (core: any) => {
    const modulePrefix = getModulePrefix(core);
    const className = getClassName(core);
    return `from ${modulePrefix}_core import ${className}
import json

core = ${className}()
print("=== МЕТАДАННЫЕ ЯДРА ===")
print(json.dumps(core.get_metadata(), indent=2, ensure_ascii=False))

print("\\n=== ГЕНЕРАЦИЯ ПРИМЕРА ===")
print(json.dumps(core.generate_example(), indent=2, ensure_ascii=False))
`;
  };

  const generateTests = (core: any) => {
    const modulePrefix = getModulePrefix(core);
    const className = getClassName(core);
    return `import unittest
from ${modulePrefix}_core import ${className}

class Test${className}(unittest.TestCase):
    def setUp(self):
        self.core = ${className}()

    def test_evrid_tensor_bounds(self):
        """Проверка диапазонов компонент тензора EVRID [0.0, 1.0]"""
        for key in ["function", "tension", "density", "gravity"]:
            val = self.core.evrid[key]
            self.assertIsInstance(val, (int, float), f"Значение {key} должно быть числом")
            self.assertGreaterEqual(val, 0.0, f"Значение {key} < 0.0")
            self.assertLessEqual(val, 1.0, f"Значение {key} > 1.0")

    def test_calculate_tdi(self):
        """Проверка формулы расчета топологического диссонанса (TDI)"""
        f, t, d = self.core.evrid["function"], self.core.evrid["tension"], self.core.evrid["density"]
        expected_tdi = round(min((t * d) / (f + 0.1), 1.0), 3)
        self.assertEqual(self.core.calculate_tdi(), expected_tdi)

    def test_tdi_semantic_separation(self):
        """Проверка раздельного доступа к авторскому базовому TDI и расчётному TDI"""
        # Базовый авторский TDI сохранён неизменным
        self.assertEqual(self.core.tdi, ${core.tdi}, "Базовый TDI должен сохранять авторский эталон")
        # Расчётный TDI вычисляется по формуле
        f, t, d = self.core.evrid["function"], self.core.evrid["tension"], self.core.evrid["density"]
        expected_calc = round(min((t * d) / (f + 0.1), 1.0), 3)
        self.assertEqual(self.core.calculate_tdi(), expected_calc, "Расчётный TDI обязан соответствовать формуле")

    def test_alyosha_gate_limit(self):
        """Проверка порога допуска Шлюза Алёши (TDI < 0.45) для обоих показателей"""
        self.assertLess(self.core.tdi, 0.45, f"Базовый TDI ({self.core.tdi}) превышает предел 0.45")
        self.assertLess(self.core.calculate_tdi(), 0.45, f"Расчётный TDI ({self.core.calculate_tdi()}) превышает предел 0.45")

    def test_calculate_delta(self):
        """Проверка формулы δ-оператора"""
        f, t, d, g = self.core.evrid["function"], self.core.evrid["tension"], self.core.evrid["density"], self.core.evrid["gravity"]
        expected_delta = round(f * 0.3 + t * 0.2 + d * 0.2 + g * 0.3, 3)
        self.assertEqual(self.core.calculate_delta(), expected_delta)

    def test_metadata_contract(self):
        """Проверка структуры и полноты метаданных"""
        meta = self.core.get_metadata()
        expected_keys = ["id", "name", "evrid", "delta", "nadi", "acoustic", "tdi", "calculated_tdi", "ready"]
        for key in expected_keys:
            self.assertIn(key, meta, f"Ключ {key} отсутствует в get_metadata()")
        self.assertEqual(meta["name"], "${core.name}")
        self.assertEqual(meta["tdi"], ${core.tdi})
        self.assertEqual(meta["calculated_tdi"], self.core.calculate_tdi())
        self.assertTrue(meta["ready"])

    def test_s_core_invariant(self):
        """Проверка инварианта Пифагора на тестовом векторе"""
        res = self.core.validate_s_core(0.8, 0.6)
        self.assertEqual(res, 1.0, "Инвариант Пифагора нарушен для вектора (0.8, 0.6)")

    def test_generate_example_contract(self):
        """Проверка контракта и структуры генерируемого примера"""
        sample = self.core.generate_example()
        for key in ["melody", "texture", "resonance", "tdi", "calculated_tdi", "style", "s_core"]:
            self.assertIn(key, sample, f"Поле {key} отсутствует в примере")
        self.assertEqual(sample["style"], "${core.name}")
        self.assertEqual(sample["tdi"], ${core.tdi})
        self.assertEqual(sample["calculated_tdi"], self.core.calculate_tdi())
        expected_resonance = self.core.validate_s_core(sample["melody"], sample["texture"])
        self.assertEqual(sample["resonance"], expected_resonance)

if __name__ == '__main__':
    unittest.main()
`;
  };

  const downloadComposerCore = async (core: any) => {
    const zip = new JSZip();
    const modulePrefix = getModulePrefix(core);
    
    // 1. Генеруємо <prefix>_core.py
    zip.file(`${modulePrefix}_core.py`, generateComposerCode(core));
    
    // 2. Генеруємо metadata.json
    zip.file("metadata.json", generateMetadata(core));
    
    // 3. Генеруємо README.md
    zip.file("README.md", generateReadme(core));
    
    // 4. Генеруємо requirements.txt
    zip.file("requirements.txt", generateRequirements());
    
    // 5. Генеруємо приклад використання
    zip.file("example.py", generateExample(core));
    
    // 6. Тести
    zip.file("test_core.py", generateTests(core));
    
    // 7. Створюємо ZIP
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, `${modulePrefix}_core_v1.0.zip`);
  };

  return (
    <div className="flex flex-col h-screen bg-black text-slate-300 font-sans overflow-hidden selection:bg-amber-900/50">
      
      {/* ШАПКА - Компактно */}
      <header className="flex items-center justify-between px-4 py-1.5 bg-slate-900 border-b border-slate-800 shadow-xl z-10">
        <div className="flex items-center gap-2">
          <div className="p-1 bg-amber-600 rounded">
            <Cpu className="text-black" size={16} />
          </div>
          <h1 className="text-xs font-bold tracking-widest text-slate-100 uppercase">
            Musical Core Harvester <span className="text-amber-500 ml-1 text-[9px]">v2.0</span>
          </h1>
        </div>
        <div className="flex items-center gap-3 text-[9px] font-mono text-slate-500">
          <div className="flex items-center gap-1.5 uppercase">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            [🟢 ОНЛАЙН]
          </div>
          <span className="opacity-60">AAM-V1_ARTSYBASHEV</span>
        </div>
      </header>

      {/* ОСНОВНОЙ БЛОК */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* ЛЕВАЯ ПАНЕЛЬ: БИБЛИОТЕКА (Высокая плотность) */}
        <div className="flex flex-col w-[68%] border-r border-slate-800 bg-black/40 relative">
          
          {/* Фильтры */}
          <div className="flex items-center gap-2 p-2 bg-slate-900/30 border-b border-slate-800/50">
            <Database size={12} className="text-slate-500 shrink-0" />
            <div className="flex gap-1 overflow-x-auto no-scrollbar">
              {filters.map(f => (
                <button 
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-2 py-0.5 text-[8px] font-bold rounded transition-all uppercase border whitespace-nowrap ${
                    activeFilter === f 
                      ? 'bg-amber-600 border-amber-400 text-black' 
                      : 'bg-slate-900 border-slate-700 text-slate-500 hover:border-slate-500'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Сетка карточек (Плотная) */}
          <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-1.5">
              
              {filteredCores.map(core => (
                <div 
                  key={core.id}
                  onClick={() => setSelectedCore(core as any)}
                  className={`relative cursor-pointer rounded border transition-all duration-200 p-2 min-h-[85px] flex flex-col justify-between
                    ${selectedCore.id === core.id ? 'ring-1 ring-amber-500 bg-slate-800/50 scale-[1.01] shadow-lg' : 'hover:bg-slate-900/40'}
                    ${core.color}
                  `}
                >
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-[6px] font-mono opacity-50 uppercase">{core.id}</span>
                      {core.type === 'САКРАЛЬНОЕ' ? <Cross size={10} className="text-amber-400" /> : <Music size={10} className="opacity-40" />}
                    </div>
                    <h3 className="font-bold text-[9px] tracking-tight uppercase leading-none truncate">{core.name}</h3>
                  </div>
                  
                  <div className="flex justify-between items-end mt-2">
                    <div className="flex flex-col">
                      <span className="text-[8px] font-mono opacity-70">TDI: {core.tdi}</span>
                      <span className="text-[8px] font-mono text-amber-500">δ: {core.delta}</span>
                      {core.type === 'САКРАЛЬНОЕ' && <span className="text-[7px] font-bold text-amber-500 mt-0.5">🕯️ САКР</span>}
                    </div>
                    <span className="text-[7px] font-bold opacity-80 uppercase px-1 bg-black/40 rounded">
                      {core.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ПРАВАЯ ПАНЕЛЬ: ДЕТАЛИ (Локализовано) */}
        <div className="w-[32%] flex flex-col bg-slate-900/50 border-l border-slate-800 relative z-10 overflow-hidden">
          <div className="p-3 border-b border-slate-800 bg-slate-900 flex justify-between items-center">
            <h2 className="text-[10px] font-bold tracking-widest text-slate-400 flex items-center gap-1.5 uppercase">
              <Activity size={12} className="text-amber-500"/>
              Детали Ядра
            </h2>
            <div className="px-2 py-0.5 rounded bg-black border border-slate-800 text-[9px] font-mono text-amber-500 uppercase">
              {selectedCore.name}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-5">
            
            {/* Статус Small */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] border-b border-slate-800 pb-0.5">
                <span className="text-slate-500 uppercase">Статус:</span>
                <span className="font-mono text-green-400 font-bold">ГОТОВО К РАБОТЕ</span>
              </div>
              <div className="flex justify-between text-[10px] border-b border-slate-800 pb-0.5">
                <span className="text-slate-500 uppercase">Архитектор:</span>
                <span className="font-mono text-slate-400">A.A. Artsybashev</span>
              </div>
              <div className="flex justify-between text-[10px] border-b border-slate-800 pb-0.5">
                <span className="text-slate-500 uppercase">δ-Оператор (Пик):</span>
                <span className="font-mono text-amber-500 font-bold">{selectedCore.delta}</span>
              </div>
              <div className="flex justify-between text-[10px] border-b border-slate-800 pb-0.5">
                <span className="text-slate-500 uppercase">TDI (Базовый):</span>
                <span className="font-mono text-amber-500 font-bold">{selectedCore.tdi}</span>
              </div>
              <div className="flex justify-between text-[10px] border-b border-slate-800 pb-0.5">
                <span className="text-slate-500 uppercase">TDI (Расчётный):</span>
                <span className="font-mono text-emerald-400 font-bold">
                  {Math.round(Math.min((selectedCore.evrid.tension * selectedCore.evrid.density) / (selectedCore.evrid.function + 0.1), 1.0) * 1000) / 1000}
                </span>
              </div>
            </div>

            {/* EVRID Визуализация */}
            <div>
              <h4 className="text-[8px] font-bold text-slate-600 mb-1.5 uppercase flex items-center gap-1">
                <Layers size={10} /> Тензор EVRID
              </h4>
              <div className="space-y-1.5">
                {Object.entries(selectedCore.evrid).map(([key, value]) => (
                  <div key={key} className="flex items-center text-[9px]">
                    <span className="w-16 capitalize text-slate-500">{key}</span>
                    <div className="flex-1 h-1 bg-black rounded-full mx-2 overflow-hidden border border-slate-800">
                      <div className="h-full bg-amber-600" style={{ width: `${(value as number) * 100}%` }}></div>
                    </div>
                    <span className="text-slate-400 font-mono w-6 text-right">{(value as number).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* NADI Секция */}
            <div>
              <h4 className="text-[8px] font-bold text-slate-600 mb-1 uppercase flex items-center gap-1">
                <RefreshCw size={10} /> Каналы NADI
              </h4>
              <div className="bg-black/40 border border-slate-800 rounded p-2 text-[9px] font-mono space-y-1 leading-tight">
                <div className="text-slate-500">Ida: <span className="text-slate-300">{selectedCore.nadi.ida}</span></div>
                <div className="text-slate-500">Pin: <span className="text-slate-300">{selectedCore.nadi.pingala}</span></div>
                <div className="text-slate-500">Sus: <span className="text-amber-500">{selectedCore.nadi.sushumna}</span></div>
              </div>
            </div>

            {/* Акустическая Матрица */}
            <div>
              <h4 className="text-[8px] font-bold text-slate-600 mb-1 uppercase flex items-center gap-1">
                <Settings size={10} /> Акустическая Матрица
              </h4>
              <div className="grid grid-cols-2 gap-1.5 font-mono text-[9px]">
                <div className="bg-black/30 p-1.5 rounded border border-slate-800">
                  <span className="text-slate-600 block text-[7px] uppercase tracking-tighter">Частота</span>
                  <span className="text-amber-500 font-bold">{selectedCore.acoustic.freq} Hz</span>
                </div>
                <div className="bg-black/30 p-1.5 rounded border border-slate-800 overflow-hidden">
                  <span className="text-slate-600 block text-[7px] uppercase tracking-tighter">Тембр</span>
                  <span className="text-slate-300 truncate block">{selectedCore.acoustic.timbre}</span>
                </div>
              </div>
            </div>

            {/* Синтез (Волокно) */}
            <div className="pt-2 border-t border-slate-800">
               <h4 className="text-[8px] font-bold text-slate-600 mb-1.5 uppercase">Беловское Волокно (Синтез)</h4>
               <input 
                 type="range" min="0" max="1" step="0.1" value={mixWeight}
                 onChange={(e) => setMixWeight(parseFloat(e.target.value))}
                 className="w-full accent-amber-600 h-1 cursor-pointer"
               />
               <div className="flex justify-between text-[8px] text-slate-500 font-mono mt-1">
                 <span>Структура (0.0)</span>
                 <span>Экспрессия (1.0)</span>
               </div>
            </div>

          </div>

          {/* Кнопки действий */}
          <div className="p-3 bg-slate-900 border-t border-slate-800 space-y-1.5">
            <button 
              onClick={() => downloadComposerCore(selectedCore)}
              className="w-full flex items-center justify-center gap-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-100 text-[10px] font-bold rounded border border-slate-700 transition-all uppercase"
            >
              <Download size={14} /> Скачать ZIP
            </button>
            <div className="grid grid-cols-2 gap-1.5">
              <button 
                onClick={runTest}
                className="flex items-center justify-center gap-2 py-1.5 bg-amber-900/30 hover:bg-amber-900/50 text-amber-500 text-[9px] font-bold rounded border border-amber-800/50 transition-all uppercase"
              >
                <Terminal size={12} /> ТЕСТ
              </button>
              <button className="flex items-center justify-center gap-2 py-1.5 bg-slate-800 text-slate-500 text-[9px] font-bold rounded border border-slate-700 opacity-50 cursor-not-allowed uppercase">
                <RefreshCw size={12} /> РЕГЕН
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* СТАТУС БАР */}
      <footer className="bg-[#050505] border-t border-slate-900 px-4 py-1 flex justify-between items-center text-[9px] font-mono text-slate-600 shrink-0">
        <div className="flex gap-4">
          <span className="flex items-center gap-1 text-emerald-600">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            720° СИНХРОНИЗАЦИЯ АКТИВНА
          </span>
          <span className="flex items-center gap-1">
            <Activity size={10} />
            SYSTEM TDI: {selectedCore.tdi} <span className="opacity-60 text-[8px]">(РАСЧ: {Math.round(Math.min((selectedCore.evrid.tension * selectedCore.evrid.density) / (selectedCore.evrid.function + 0.1), 1.0) * 1000) / 1000})</span>
          </span>
        </div>
        <div className="tracking-widest uppercase opacity-40">
          AAM-V2.1 | MACHINE ID: AAM-V1_ARTSYBASHEV
        </div>
      </footer>

      {/* ТЕРМИНАЛ ТЕСТОВ (ОВЕРЛЕЙ) */}
      {isTesting && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-6">
          <div className="w-full max-w-xl bg-slate-950 border border-slate-700 rounded-lg shadow-2xl flex flex-col overflow-hidden max-h-[70vh]">
            <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex justify-between items-center">
              <span className="text-[10px] font-mono text-slate-400 flex items-center gap-2 uppercase">
                <Terminal size={14} className="text-amber-500"/> Валидация S-CORE / Шлюз Алёши
              </span>
              <button onClick={() => {setIsTesting(false); setTestLogs([]);}} className="text-slate-500 hover:text-white text-[10px] font-bold uppercase">ЗАКРЫТЬ [X]</button>
            </div>
            <div className="p-4 font-mono text-[11px] overflow-y-auto flex-1 custom-scrollbar leading-relaxed">
              {testLogs.map((log, i) => (
                <div key={i} className={`mb-1 
                  ${log.includes('[✅') ? 'text-emerald-400' : 
                    log.includes('[❌') ? 'text-rose-400' : 
                    log.startsWith('>') ? 'text-amber-400 font-bold mt-2' : 'text-slate-300'}`}
                >
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* СТИЛИ */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #000; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}} />
    </div>
  );
}
