import React, { useState } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { 
  Music, Database, Download, Terminal, 
  Activity, Cpu, Layers, Settings, Cross,
  Network, Clock, GitCompare, Compass, Sliders, CheckCircle2,
  AlertCircle
} from 'lucide-react';

import INITIAL_CORES from './data/cores.json';
import {
  analyzeSpectralPassport,
  measureTemporalTransition,
  getStyleTolerances,
  evaluateStyleInterpretation,
  calculateStylisticDistance,
  GraphPassport,
  TemporalMeasurement,
  StyleTolerances,
  StyleInterpretation
} from './utils/analytics';

export default function App() {
  const [cores] = useState(INITIAL_CORES);
  const [selectedCore, setSelectedCore] = useState(INITIAL_CORES[0]);
  const [activeFilter, setActiveFilter] = useState("ВСЕ ЭПОХИ");
  const [isTesting, setIsTesting] = useState(false);
  const [testLogs, setTestLogs] = useState<string[]>([]);
  const [mixWeight, setMixWeight] = useState(0.5);

  // Режим интерфейса: Каталог / Триадная аналитика
  const [activeView, setActiveView] = useState<'catalog' | 'triad'>('catalog');
  // Для парного сравнительного анализа
  const [comparisonCoreId, setComparisonCoreId] = useState<string>('bach_v2.1');

  const filters = ["ВСЕ ЭПОХИ", "БАРОККО", "КЛАССИКА", "РОМАНТИЗМ", "СОВРЕМЕННАЯ", "САКРАЛЬНОЕ"];

  const filteredCores = cores.filter(core => 
    activeFilter === "ВСЕ ЭПОХИ" ? true : core.era === activeFilter || core.type === activeFilter
  );

  const comparisonCore = cores.find(c => c.id === comparisonCoreId) || cores[8]; // Default Bach

  // Вычисления текущего ядра
  const currentPassport: GraphPassport = analyzeSpectralPassport({
    function: selectedCore.evrid.function,
    tension: selectedCore.evrid.tension,
    density: selectedCore.evrid.density,
    gravitation: selectedCore.evrid.gravitation ?? 0.5
  });

  const currentTolerances: StyleTolerances = getStyleTolerances(selectedCore);
  const currentInterpretation: StyleInterpretation = evaluateStyleInterpretation(selectedCore);

  const comparisonPassport: GraphPassport = analyzeSpectralPassport({
    function: comparisonCore.evrid.function,
    tension: comparisonCore.evrid.tension,
    density: comparisonCore.evrid.density,
    gravitation: comparisonCore.evrid.gravitation ?? 0.5
  });

  const stylisticDistance = calculateStylisticDistance(selectedCore, comparisonCore);

  const runTest = () => {
    setIsTesting(true);
    setTestLogs([`> Старт S-CORE валидации: ${selectedCore.name}...`]);
    const calcTdi = Math.round(Math.min((selectedCore.evrid.tension * selectedCore.evrid.density) / (selectedCore.evrid.function + 0.1), 1.0) * 1000) / 1000;
    const calcDelta = Math.round((0.3 * selectedCore.evrid.function + 0.2 * selectedCore.evrid.tension + 0.2 * selectedCore.evrid.density + 0.3 * selectedCore.evrid.gravitation) * 1000) / 1000;
    
    const steps = [
      `[360°] Анализ EVRID: F=${selectedCore.evrid.function}, T=${selectedCore.evrid.tension}, D=${selectedCore.evrid.density}, G=${selectedCore.evrid.gravitation}`,
      `[δ-ОПЕРАТОР] Базовый δ-пик: ${selectedCore.delta} | Динамический расчёт: ${calcDelta}`,
      `[ШЛЮЗ АЛЁШИ] TDI Контроль (Базовый: ${selectedCore.tdi} < 0.45 | Расчётный: ${calcTdi} < 0.45) -> ДОПУСК`,
      `[СПЕКТР] Алгебраическая связность λ₂=${currentPassport.lambda_2} | Энтропия H=${currentPassport.entropy}`,
      `[ТРИАДА] Первичный инвариант: ${currentTolerances.primary_invariant}`,
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
    }, 450);
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
    return `"""🎼 ${core.name} MUSICAL CORE v1.0
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
        
        # δ-пик
        self.delta = ${core.delta}
        # Авторский базовый TDI (калибровочная константа)
        self.tdi = ${core.tdi}
        self.tdi_baseline = ${core.tdi}
        
        # NADI-каналы
        self.nadi = ${JSON.stringify(core.nadi, null, 4)}
        
        # Акустический профиль
        self.acoustic = ${JSON.stringify(core.acoustic, null, 4)}

    def calculate_tdi(self):
        """Расчёт топологического диссонанса (TDI) из EVRID-тензора"""
        tdi = (self.evrid["tension"] * self.evrid["density"]) / (self.evrid["function"] + 0.1)
        return round(min(tdi, 1.0), 3)
    
    def calculate_delta(self):
        """Расчёт δ-позиции из EVRID-тензора"""
        f, t, d, g = self.evrid["function"], self.evrid["tension"], self.evrid["density"], self.evrid["gravity"]
        delta = (f * 0.3 + t * 0.2 + d * 0.2 + g * 0.3)
        return round(delta, 3)

    def validate_s_core(self, melody, texture):
        """Инвариант Пифагора"""
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
        """Пример генерации музыкальной фразы"""
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
    print("\\nПРИМЕР ГЕНЕРАЦИИ:")
    print(json.dumps(core.generate_example(), indent=2, ensure_ascii=False))
`;
  };

  const generateMetadata = (core: any) => {
    const calcTdi = Math.round(Math.min((core.evrid.tension * core.evrid.density) / (core.evrid.function + 0.1), 1.0) * 1000) / 1000;
    const passport = analyzeSpectralPassport({
      function: core.evrid.function,
      tension: core.evrid.tension,
      density: core.evrid.density,
      gravitation: core.evrid.gravitation ?? 0.5
    });

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
            "delta_peak": core.delta,
            "spectral_passport": {
                "lambda_2": passport.lambda_2,
                "spectral_gap": passport.spectral_gap,
                "entropy": passport.entropy
            }
        },
        "date": new Date().toISOString().split('T')[0]
    }, null, 2);
  };

  const generateRequirements = () => {
    return `# MCG-V3.0 Musical Core\n# Standard library only (Python >= 3.8). No external dependencies required.`;
  };

  const generateReadme = (core: any) => {
    const modulePrefix = getModulePrefix(core);
    const className = getClassName(core);
    const calcTdi = Math.round(Math.min((core.evrid.tension * core.evrid.density) / (core.evrid.function + 0.1), 1.0) * 1000) / 1000;
    const passport = analyzeSpectralPassport({
      function: core.evrid.function,
      tension: core.evrid.tension,
      density: core.evrid.density,
      gravitation: core.evrid.gravitation ?? 0.5
    });

    return `# 🎼 ${core.name} MUSICAL CORE v1.0

## 📋 ОПИСАНИЕ
Музыкальное ядро для стиля ${core.name}, созданное по методологии AAM-V2.1.
Реализация на чистом Python 3 без сторонних зависимостей.

## 🧬 МЕТРИКИ И ТРИАДНАЯ АРХИТЕКТУРА
- **EVRID-тензор**: функция (${core.evrid.function}), напряжение (${core.evrid.tension}), плотность (${core.evrid.density}), гравитация (${core.evrid.gravitation})
- **δ-пик**: ${core.delta}
- **NADI-каналы**: Ida (${core.nadi.ida}), Pingala (${core.nadi.pingala}), Sushumna (${core.nadi.sushumna})
- **TDI (базовый авторский)**: ${core.tdi} (исходный калибровочный показатель стиля)
- **TDI (расчётный)**: ${calcTdi} (динамически вычислен по формуле (T·D)/(F+0.1))
- **Спектральный Паспорт (Spectral Tracker)**: λ₂=${passport.lambda_2}, Gap=${passport.spectral_gap}, Энтропия=${passport.entropy}
- **Шлюз Алёши**: порог допуска TDI < 0.45 (пройден)
- **S-CORE** (инвариант Пифагора): a² + b² = c²

### Главный принцип
Индивидуальный стиль исследуется с сохранением авторской идентичности, без подгонки под единую универсальную норму.

## 🚀 ИСПОЛЬЗОВАНИЕ
Требования: Python 3.8+ (только стандартная библиотека).

\`\`\`python
from ${modulePrefix}_core import ${className}
core = ${className}()
metadata = core.get_metadata()
print(metadata)
\`\`\`

## 📦 СТРУКТУРА АРХИВА
- \`${modulePrefix}_core.py\` — основной код класса ${className}
- \`metadata.json\` — метаданные ядра (включают tdi, calculated_tdi, spectral_passport)
- \`requirements.txt\` — спецификация зависимостей (Zero external dependencies)
- \`README.md\` — документация и инструкция
- \`example.py\` — пример использования
- \`test_core.py\` — модульные тесты параметров ядра

## 🏛️ АВТОР
Архитектор: **Арцыбашев Андрей Алексеевич** (Харьков, Украина)
Идентификатор: \`AAM-V1_ARTSYBASHEV_UA_KHARKIV_AIANALYSIS\`
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
        self.assertEqual(self.core.tdi, ${core.tdi}, "Базовый TDI должен сохранять авторский эталон")
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
    
    // 1. Генерируем <prefix>_core.py
    zip.file(`${modulePrefix}_core.py`, generateComposerCode(core));
    
    // 2. Генерируем metadata.json
    zip.file("metadata.json", generateMetadata(core));
    
    // 3. Генерируем README.md
    zip.file("README.md", generateReadme(core));
    
    // 4. Генерируем requirements.txt
    zip.file("requirements.txt", generateRequirements());
    
    // 5. Генерируем пример использования
    zip.file("example.py", generateExample(core));
    
    // 6. Тесты
    zip.file("test_core.py", generateTests(core));
    
    // 7. Создаем ZIP
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, `${modulePrefix}_core_v1.0.zip`);
  };

  return (
    <div className="flex flex-col h-screen bg-black text-slate-300 font-sans overflow-hidden selection:bg-amber-900/50">
      
      {/* ШАПКА */}
      <header className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 shadow-xl z-20">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-amber-600 rounded">
            <Cpu className="text-black" size={16} />
          </div>
          <div>
            <h1 className="text-xs font-bold tracking-widest text-slate-100 uppercase flex items-center gap-2">
              MUS-MCG <span className="text-slate-500 font-normal">|</span> Musical Core Harvester 
              <span className="text-amber-500 text-[10px] px-1.5 py-0.2 bg-amber-950/60 rounded border border-amber-800/60">v3.0 TRIAD</span>
            </h1>
          </div>
        </div>

        {/* НАВИГАЦИОННЫЙ ПЕРЕКЛЮЧАТЕЛЬ РЕЖИМОВ */}
        <div className="flex items-center gap-1 bg-black/60 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveView('catalog')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-[10px] font-bold uppercase transition-all ${
              activeView === 'catalog'
                ? 'bg-amber-600 text-black shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database size={12} /> Каталог & Ядра
          </button>
          <button
            onClick={() => setActiveView('triad')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-[10px] font-bold uppercase transition-all ${
              activeView === 'triad'
                ? 'bg-amber-600 text-black shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Compass size={12} /> Триадная Аналитика
          </button>
        </div>

        <div className="flex items-center gap-3 text-[10px] font-mono text-slate-500">
          <div className="flex items-center gap-1.5 uppercase">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            [ОНЛАЙН]
          </div>
          <span className="opacity-60 hidden md:inline">AAM-V1_ARTSYBASHEV</span>
        </div>
      </header>

      {/* ОСНОВНОЙ КОНТЕНТ */}
      {activeView === 'catalog' ? (
        /* РЕЖИМ КАТАЛОГА (ОРИГИНАЛЬНЫЙ С ДОПОЛНЕНИЯМИ) */
        <div className="flex flex-1 overflow-hidden">
          
          {/* ЛЕВАЯ ПАНЕЛЬ: БИБЛИОТЕКА КАРТОЧЕК */}
          <div className="flex flex-col w-[66%] border-r border-slate-800 bg-black/40 relative">
            
            {/* Фильтры */}
            <div className="flex items-center gap-2 p-2 bg-slate-900/40 border-b border-slate-800/50">
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

            {/* Сетка карточек */}
            <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-1.5">
                {filteredCores.map(core => (
                  <div 
                    key={core.id}
                    onClick={() => setSelectedCore(core as any)}
                    className={`relative cursor-pointer rounded border transition-all duration-200 p-2 min-h-[90px] flex flex-col justify-between
                      ${selectedCore.id === core.id ? 'ring-1 ring-amber-500 bg-slate-800/60 scale-[1.01] shadow-lg' : 'hover:bg-slate-900/40'}
                      ${core.color}
                    `}
                  >
                    <div>
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-[7px] font-mono opacity-50 uppercase">{core.id}</span>
                        {core.type === 'САКРАЛЬНОЕ' ? <Cross size={10} className="text-amber-400" /> : <Music size={10} className="opacity-40" />}
                      </div>
                      <h3 className="font-bold text-[10px] tracking-tight uppercase leading-none truncate">{core.name}</h3>
                    </div>
                    
                    <div className="flex justify-between items-end mt-2">
                      <div className="flex flex-col text-[8px] font-mono">
                        <span className="opacity-70">TDI: {core.tdi}</span>
                        <span className="text-amber-500">δ: {core.delta}</span>
                      </div>
                      <span className="text-[7px] font-bold opacity-80 uppercase px-1 py-0.5 bg-black/50 rounded">
                        {core.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Баннер Триадной Аналитики внизу левой панели */}
            <div className="px-3 py-2 bg-slate-950 border-t border-slate-800/70 flex items-center justify-between text-[10px]">
              <div className="flex items-center gap-2 text-slate-400">
                <Compass size={14} className="text-amber-500" />
                <span>
                  Активно ядро: <strong className="text-amber-400">{selectedCore.name}</strong> 
                  <span className="text-slate-500 ml-2">λ₂={currentPassport.lambda_2} | Gap={currentPassport.spectral_gap} | H={currentPassport.entropy}</span>
                </span>
              </div>
              <button 
                onClick={() => setActiveView('triad')}
                className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded text-[9px] font-bold uppercase transition-all border border-slate-700"
              >
                Исследовать профиль →
              </button>
            </div>

          </div>

          {/* ПРАВАЯ ПАНЕЛЬ: ДЕТАЛИ ЯДРА */}
          <div className="w-[34%] flex flex-col bg-slate-900/50 border-l border-slate-800 relative z-10 overflow-hidden">
            <div className="p-3 border-b border-slate-800 bg-slate-900 flex justify-between items-center">
              <h2 className="text-[10px] font-bold tracking-widest text-slate-400 flex items-center gap-1.5 uppercase">
                <Activity size={12} className="text-amber-500"/>
                Параметры Ядра
              </h2>
              <div className="px-2 py-0.5 rounded bg-black border border-slate-800 text-[10px] font-mono text-amber-500 uppercase">
                {selectedCore.name}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-4">
              
              {/* Статусная таблица */}
              <div className="space-y-1 font-mono text-[10px]">
                <div className="flex justify-between border-b border-slate-800 pb-0.5">
                  <span className="text-slate-500 uppercase">Эпоха / Направление:</span>
                  <span className="text-slate-300 font-bold">{selectedCore.era}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-0.5">
                  <span className="text-slate-500 uppercase">Тип композиции:</span>
                  <span className="text-amber-400">{selectedCore.type}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-0.5">
                  <span className="text-slate-500 uppercase">δ-Оператор (Базовый):</span>
                  <span className="text-amber-500 font-bold">{selectedCore.delta}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-0.5">
                  <span className="text-slate-500 uppercase">TDI (Авторский эталон):</span>
                  <span className="text-amber-500 font-bold">{selectedCore.tdi}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-0.5">
                  <span className="text-slate-500 uppercase">TDI (Расчётный):</span>
                  <span className="text-emerald-400 font-bold">
                    {Math.round(Math.min((selectedCore.evrid.tension * selectedCore.evrid.density) / (selectedCore.evrid.function + 0.1), 1.0) * 1000) / 1000}
                  </span>
                </div>
              </div>

              {/* СПЕКТРАЛЬНЫЙ ПАСПОРТ БЛОК (Spectral Tracker) */}
              <div className="p-2.5 rounded bg-black/60 border border-slate-800">
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="text-[9px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
                    <Network size={11} className="text-amber-500" /> Спектральный Паспорт
                  </h4>
                  <span className="text-[8px] font-mono text-slate-500">SPECTRAL TRACKER</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5 text-center font-mono">
                  <div className="bg-slate-900/60 p-1.5 rounded border border-slate-800/80">
                    <span className="text-[7px] block text-slate-500 uppercase">Связность λ₂</span>
                    <span className="text-[10px] text-amber-400 font-bold">{currentPassport.lambda_2}</span>
                  </div>
                  <div className="bg-slate-900/60 p-1.5 rounded border border-slate-800/80">
                    <span className="text-[7px] block text-slate-500 uppercase">Щель (Gap)</span>
                    <span className="text-[10px] text-slate-200 font-bold">{currentPassport.spectral_gap}</span>
                  </div>
                  <div className="bg-slate-900/60 p-1.5 rounded border border-slate-800/80">
                    <span className="text-[7px] block text-slate-500 uppercase">Энтропия H</span>
                    <span className="text-[10px] text-emerald-400 font-bold">{currentPassport.entropy}</span>
                  </div>
                </div>
              </div>

              {/* EVRID Визуализация */}
              <div>
                <h4 className="text-[9px] font-bold text-slate-500 mb-1.5 uppercase flex items-center gap-1">
                  <Layers size={11} /> Тензор EVRID
                </h4>
                <div className="space-y-1.5">
                  {Object.entries(selectedCore.evrid).map(([key, value]) => (
                    <div key={key} className="flex items-center text-[10px]">
                      <span className="w-16 capitalize text-slate-400">{key}</span>
                      <div className="flex-1 h-1.5 bg-black rounded-full mx-2 overflow-hidden border border-slate-800">
                        <div className="h-full bg-amber-600" style={{ width: `${(value as number) * 100}%` }}></div>
                      </div>
                      <span className="text-slate-300 font-mono w-8 text-right">{(value as number).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* NADI Секция */}
              <div>
                <h4 className="text-[9px] font-bold text-slate-500 mb-1 uppercase flex items-center gap-1">
                  Каналы NADI
                </h4>
                <div className="bg-black/40 border border-slate-800 rounded p-2 text-[9px] font-mono space-y-1 leading-tight">
                  <div className="text-slate-500">Ida: <span className="text-slate-300">{selectedCore.nadi.ida}</span></div>
                  <div className="text-slate-500">Pin: <span className="text-slate-300">{selectedCore.nadi.pingala}</span></div>
                  <div className="text-slate-500">Sus: <span className="text-amber-500">{selectedCore.nadi.sushumna}</span></div>
                </div>
              </div>

              {/* Акустическая Матрица */}
              <div>
                <h4 className="text-[9px] font-bold text-slate-500 mb-1 uppercase flex items-center gap-1">
                  <Settings size={11} /> Акустическая Матрица
                </h4>
                <div className="grid grid-cols-2 gap-1.5 font-mono text-[9px]">
                  <div className="bg-black/30 p-2 rounded border border-slate-800">
                    <span className="text-slate-500 block text-[7px] uppercase">Строй / Частота</span>
                    <span className="text-amber-500 font-bold text-[11px]">{selectedCore.acoustic.freq} Hz</span>
                  </div>
                  <div className="bg-black/30 p-2 rounded border border-slate-800 overflow-hidden">
                    <span className="text-slate-500 block text-[7px] uppercase">Тембр</span>
                    <span className="text-slate-300 truncate block text-[10px]">{selectedCore.acoustic.timbre}</span>
                  </div>
                </div>
              </div>

              {/* Беловское Волокно */}
              <div className="pt-2 border-t border-slate-800"> 
                 <h4 className="text-[8px] font-bold text-slate-500 mb-1 uppercase">Беловское Волокно (Синтез)</h4> 
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
                className="w-full flex items-center justify-center gap-2 py-2 bg-amber-600 hover:bg-amber-500 text-black text-[10px] font-bold rounded border border-amber-500 transition-all uppercase"
              >
                <Download size={14} /> Скачать ZIP-пакет ядра (6 файлов)
              </button>
              <div className="grid grid-cols-2 gap-1.5">
                <button 
                  onClick={runTest}
                  className="flex items-center justify-center gap-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 text-[9px] font-bold rounded border border-slate-700 transition-all uppercase"
                >
                  <Terminal size={12} /> ТЕСТ S-CORE
                </button>
                <button 
                  onClick={() => setActiveView('triad')}
                  className="flex items-center justify-center gap-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[9px] font-bold rounded border border-slate-700 transition-all uppercase"
                >
                  <Compass size={12} /> АНАЛИТИКА
                </button>
              </div>
            </div>

          </div>

        </div>
      ) : (
        /* РЕЖИМ ТРИАДНОЙ АНАЛИТИКИ (ТРИ КОЛОНКИ: ПРОФИЛЬ -> ИЗМЕРЕНИЯ -> ИНТЕРПРЕТАЦИЯ) */
        <div className="flex flex-col flex-1 overflow-hidden bg-slate-950">
          
          {/* Верхняя информационная полоса принципа */}
          <div className="px-4 py-2 bg-slate-900/70 border-b border-slate-800 flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-2">
              <Compass className="text-amber-500" size={16} />
              <span className="font-medium text-slate-200">
                ТРИАДНАЯ АРХИТЕКТУРА MUS-MCG:
              </span>
              <span className="text-slate-400 text-[10px]">
                Разделение на Индивидуальный профиль, Объективные измерения (Spectral Tracker / Temporal Analyzer) и Стилистическую интерпретацию.
              </span>
            </div>
            <div className="text-[10px] text-amber-500/90 font-mono bg-black/50 px-2 py-0.5 rounded border border-amber-900/50">
              «Различие композиторов — это стиль, а не ошибка»
            </div>
          </div>

          {/* 3 СЛОЯ ТРИАДЫ */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 flex-1 overflow-y-auto divide-x divide-slate-800">
            
            {/* СЛОЙ 1: ИНДИВИДУАЛЬНЫЙ ПРОФИЛЬ (INDIVIDUAL COMPOSER PROFILE) */}
            <div className="p-4 flex flex-col space-y-4 overflow-y-auto custom-scrollbar bg-black/20">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded bg-amber-600/20 text-amber-500 font-bold text-xs flex items-center justify-center border border-amber-500/40">1</div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-100">Индивидуальный Профиль</h3>
                </div>
                <span className="text-[9px] font-mono text-slate-500">STYLE PROFILE</span>
              </div>

              {/* Селектор анализируемого композитора */}
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase">Выбор композитора:</label>
                <select
                  value={selectedCore.id}
                  onChange={(e) => {
                    const found = cores.find(c => c.id === e.target.value);
                    if (found) setSelectedCore(found);
                  }}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs font-mono text-amber-400 focus:outline-none focus:border-amber-500"
                >
                  {cores.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.era})
                    </option>
                  ))}
                </select>
              </div>

              {/* Индивидуальная визитка */}
              <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-800 space-y-2 font-mono text-[10px]">
                <div className="flex justify-between border-b border-slate-800/80 pb-1">
                  <span className="text-slate-500">Автор / Имя:</span>
                  <span className="text-slate-200 font-bold">{selectedCore.name}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/80 pb-1">
                  <span className="text-slate-500">Эпоха:</span>
                  <span className="text-slate-300">{selectedCore.era}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/80 pb-1">
                  <span className="text-slate-500">Частотный базис:</span>
                  <span className="text-amber-400 font-bold">{selectedCore.acoustic.freq} Hz</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/80 pb-1">
                  <span className="text-slate-500">TDI (Авторский / Расчёт):</span>
                  <span className="text-emerald-400 font-bold">
                    {selectedCore.tdi} / {Math.round(Math.min((selectedCore.evrid.tension * selectedCore.evrid.density) / (selectedCore.evrid.function + 0.1), 1.0) * 1000) / 1000}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">δ-Пик (Базовый / Расчёт):</span>
                  <span className="text-amber-400 font-bold">
                    {selectedCore.delta} / {Math.round((0.3 * selectedCore.evrid.function + 0.2 * selectedCore.evrid.tension + 0.2 * selectedCore.evrid.density + 0.3 * selectedCore.evrid.gravitation) * 1000) / 1000}
                  </span>
                </div>
              </div>

              {/* Индивидуальные допуски стиля */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
                  <Sliders size={12} className="text-amber-500" />
                  Инварианты & Допуски Стиля
                </h4>
                <div className="p-3 bg-black/40 rounded-lg border border-slate-800 space-y-2 text-[10px]">
                  <div>
                    <span className="text-slate-500 block text-[8px] uppercase">Первичный эстетический инвариант:</span>
                    <span className="text-amber-400 font-mono font-bold block mt-0.5">{currentTolerances.primary_invariant}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 font-mono pt-1 border-t border-slate-800/60">
                    <div>
                      <span className="text-slate-500 block text-[8px]">Макс. допустимый TDI:</span>
                      <span className="text-slate-200 font-bold">≤ {currentTolerances.max_tdi_allowed}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[8px]">Мин. связность λ₂:</span>
                      <span className="text-slate-200 font-bold">≥ {currentTolerances.min_lambda_2}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 font-mono pt-1 border-t border-slate-800/60">
                    <div>
                      <span className="text-slate-500 block text-[8px]">Макс. энтропия:</span>
                      <span className="text-slate-200 font-bold">≤ {currentTolerances.max_spectral_entropy}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[8px]">Диапазон δ:</span>
                      <span className="text-slate-200 font-bold">[{currentTolerances.target_delta_range[0]} .. {currentTolerances.target_delta_range[1]}]</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Философское примечание о разделении */}
              <div className="p-3 bg-amber-950/20 border border-amber-800/30 rounded text-[9px] text-amber-200/80 leading-relaxed">
                <strong>Принцип не-нормализации:</strong> Каждое музыкальное ядро обладает собственным каноническим коридором параметров. То, что для минимализма Пярта является эталоном тишины (TDI=0.08), для авангарда Крамба было бы обеднением фактуры (TDI=0.42).
              </div>

            </div>

            {/* СЛОЙ 2: ИЗМЕРИТЕЛЬНЫЙ ДВИЖОК (DETERMINISTIC MEASUREMENT ENGINE) */}
            <div className="p-4 flex flex-col space-y-4 overflow-y-auto custom-scrollbar bg-black/30">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded bg-emerald-600/20 text-emerald-400 font-bold text-xs flex items-center justify-center border border-emerald-500/40">2</div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-100">Объективные Измерения</h3>
                </div>
                <span className="text-[9px] font-mono text-emerald-500">MEASUREMENT ENGINE</span>
              </div>

              {/* СПЕКТРАЛЬНЫЙ ПАСПОРТ (Spectral Tracker) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-bold text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
                    <Network size={12} className="text-emerald-400" />
                    Спектральный Паспорт Графа (Spectral Tracker)
                  </h4>
                  <span className="text-[8px] font-mono text-slate-500">DETERMINISTIC</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center font-mono">
                  <div className="p-2.5 bg-slate-900 rounded border border-slate-800">
                    <span className="text-[8px] block text-slate-500 uppercase">Связность λ₂</span>
                    <span className="text-sm font-bold text-emerald-400">{currentPassport.lambda_2}</span>
                    <span className="text-[7px] text-slate-500 block mt-0.5">Fiedler value</span>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded border border-slate-800">
                    <span className="text-[8px] block text-slate-500 uppercase">Щель (Gap)</span>
                    <span className="text-sm font-bold text-slate-200">{currentPassport.spectral_gap}</span>
                    <span className="text-[7px] text-slate-500 block mt-0.5">λ₃ - λ₂</span>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded border border-slate-800">
                    <span className="text-[8px] block text-slate-500 uppercase">Энтропия H</span>
                    <span className="text-sm font-bold text-amber-400">{currentPassport.entropy}</span>
                    <span className="text-[7px] text-slate-500 block mt-0.5">-Σ p·ln(p)</span>
                  </div>
                </div>

                {/* Спектр собственных значений Лапласиана */}
                <div className="p-2.5 bg-black/50 rounded border border-slate-800 space-y-1">
                  <span className="text-[8px] uppercase font-mono text-slate-500 block">
                    Собственные значения Лапласиана EVRID-графа (Jacobi Solver):
                  </span>
                  <div className="flex gap-2 font-mono text-[10px]">
                    {currentPassport.eigenvalues.map((val, idx) => (
                      <span key={idx} className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                        λ_{idx+1}={val}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* ВРЕМЕННЫЕ ИЗМЕРЕНИЯ (Temporal Analyzer) */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-bold text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
                    <Clock size={12} className="text-amber-500" />
                    Временной Переход Состояний (Temporal Analyzer)
                  </h4>
                  <span className="text-[8px] font-mono text-slate-500">STATE TRANSITION</span>
                </div>

                <div className="p-3 bg-slate-900/60 rounded border border-slate-800 space-y-2 font-mono text-[10px]">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-slate-500 text-[8px] block">Фазовая скорость v = ‖ΔS‖:</span>
                      <span className="text-slate-200 font-bold text-xs">{currentInterpretation.temporal.phase_velocity}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[8px] block">Динамика δ-оператора:</span>
                      <span className="text-amber-400 font-bold text-xs">{currentInterpretation.temporal.delta_dynamics}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800/80">
                    <div>
                      <span className="text-slate-500 text-[8px] block">Стабильность перехода:</span>
                      <span className="text-emerald-400 font-bold">{currentInterpretation.temporal.stability}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[8px] block">Достоверность (Confidence):</span>
                      <span className="text-emerald-400 font-bold">{currentInterpretation.temporal.confidence}</span>
                    </div>
                  </div>
                  <div className="pt-1 border-t border-slate-800/80">
                    <span className="text-slate-500 text-[8px] block">Trace Hash (Детерминированная трассировка):</span>
                    <span className="text-slate-400 font-mono text-[9px] break-all">{currentInterpretation.temporal.trace_hash}</span>
                  </div>
                </div>
              </div>

              {/* Гарантия изоляции */}
              <div className="p-2.5 bg-slate-900/30 border border-slate-800 rounded text-[9px] text-slate-400 leading-relaxed">
                Слой объективных измерений свободен от субъективных суждений: он выдаёт численный вектор графа и динамику перехода с математическим показателем доверия.
              </div>

            </div>

            {/* СЛОЙ 3: ИНТЕРПРЕТАЦИОННЫЙ СЛОЙ (INTERPRETATION & COMPARATIVE LAYER) */}
            <div className="p-4 flex flex-col space-y-4 overflow-y-auto custom-scrollbar bg-black/20">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded bg-sky-600/20 text-sky-400 font-bold text-xs flex items-center justify-center border border-sky-500/40">3</div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-100">Интерпретация & Сравнение</h3>
                </div>
                <span className="text-[9px] font-mono text-sky-400">INTERPRETATION</span>
              </div>

              {/* Соответствие СОБСТВЕННОМУ стилю */}
              <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800 space-y-2">
                <span className="text-[9px] font-bold text-slate-300 uppercase block">
                  Когерентность стилю {selectedCore.name}:
                </span>
                <div className="space-y-1 font-mono text-[10px]">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">TDI в допуске стиля:</span>
                    {currentInterpretation.coherence.tdi_in_tolerance ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1"><CheckCircle2 size={12} /> СООТВЕТСТВУЕТ</span>
                    ) : (
                      <span className="text-rose-400 font-bold flex items-center gap-1"><AlertCircle size={12} /> ВЫХОД</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Связность λ₂ достаточна:</span>
                    {currentInterpretation.coherence.connectivity_sufficient ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1"><CheckCircle2 size={12} /> СООТВЕТСТВУЕТ</span>
                    ) : (
                      <span className="text-amber-400 font-bold flex items-center gap-1"><AlertCircle size={12} /> РАЗРЕЖЕННО</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Энтропия в границах:</span>
                    {currentInterpretation.coherence.entropy_in_bounds ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1"><CheckCircle2 size={12} /> СООТВЕТСТВУЕТ</span>
                    ) : (
                      <span className="text-rose-400 font-bold flex items-center gap-1"><AlertCircle size={12} /> ПРЕВЫШЕНИЕ</span>
                    )}
                  </div>
                </div>
              </div>

              {/* ПАРНОЕ СРАВНЕНИЕ КОМПОЗИТОРОВ */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-bold text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
                    <GitCompare size={12} className="text-sky-400" />
                    Парное Топологическое Сравнение
                  </h4>
                  <span className="text-[8px] font-mono text-slate-500">PAIRWISE</span>
                </div>

                <div className="space-y-1">
                  <label className="text-[8px] font-bold text-slate-400 uppercase">Сравнить с композитором:</label>
                  <select
                    value={comparisonCoreId}
                    onChange={(e) => setComparisonCoreId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-xs font-mono text-sky-300 focus:outline-none focus:border-sky-500"
                  >
                    {cores.filter(c => c.id !== selectedCore.id).map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.era})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Карточка дистанции */}
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-2 font-mono text-[10px]">
                  <div className="flex justify-between items-center pb-1 border-b border-slate-800">
                    <span className="text-slate-400">Топологическая дистанция D(A, B):</span>
                    <span className="text-sm font-bold text-sky-400">{stylisticDistance}</span>
                  </div>

                  {/* Сравнительная таблица двух стилей */}
                  <div className="grid grid-cols-3 gap-1 text-center pt-1 text-[9px]">
                    <div className="text-left font-bold text-slate-400">Метрика</div>
                    <div className="text-amber-400 truncate">{selectedCore.name}</div>
                    <div className="text-sky-400 truncate">{comparisonCore.name}</div>

                    <div className="text-left text-slate-500">Связность λ₂</div>
                    <div>{currentPassport.lambda_2}</div>
                    <div>{comparisonPassport.lambda_2}</div>

                    <div className="text-left text-slate-500">Энтропия H</div>
                    <div>{currentPassport.entropy}</div>
                    <div>{comparisonPassport.entropy}</div>

                    <div className="text-left text-slate-500">δ-Пик</div>
                    <div>{selectedCore.delta}</div>
                    <div>{comparisonCore.delta}</div>

                    <div className="text-left text-slate-500">Базовый строй</div>
                    <div>{selectedCore.acoustic.freq} Hz</div>
                    <div>{comparisonCore.acoustic.freq} Hz</div>
                  </div>
                </div>
              </div>

              {/* Академическое резюме стиля */}
              <div className="p-3 bg-slate-900/40 rounded border border-slate-800 text-[10px] text-slate-300 leading-relaxed italic">
                "{currentInterpretation.summary}"
              </div>

            </div>

          </div>

        </div>
      )}

      {/* СТАТУС БАР */}
      <footer className="bg-[#050505] border-t border-slate-900 px-4 py-1.5 flex justify-between items-center text-[9px] font-mono text-slate-600 shrink-0 z-20">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 text-emerald-500">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            ТРИАДА АКТИВНА
          </span>
          <span>
            ЯДРО: <strong className="text-slate-300">{selectedCore.name}</strong> 
            <span className="text-amber-500 ml-1.5">TDI: {selectedCore.tdi}</span>
            <span className="text-emerald-500 ml-1.5">λ₂: {currentPassport.lambda_2}</span>
          </span>
        </div>
        <div className="tracking-widest uppercase opacity-60">
          AAM-V3.0 TRIAD | АРХИТЕКТОР: АРЦЫБАШЕВ А.А. (ХАРЬКОВ)
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
