/**
 * School Curriculum Level Database & Teacher Custom Levels Storage
 * Subjects:
 * 1. Математика и Алгебра
 * 2. Физика
 * 3. Русский язык
 * 4. Биология и Анатомия
 * 5. География
 * 6. История
 * + Teacher Custom Levels from localStorage
 */

const DEFAULT_SCHOOL_LEVELS = [
    // ==========================================
    // 1. МАТЕМАТИКА И АЛГЕБРА
    // ==========================================
    {
        id: "school-math",
        title: "1. Математика: Дроби, Уравнения и Теоремы",
        description: "Отразите натиск ошибок в вычислениях! Примените правила работы с дробями, процентами, уравнениями и геометрией.",
        subjectIcon: "📐",
        isCustom: false,
        path: [
            { x: 30, y: 150 },
            { x: 260, y: 150 },
            { x: 260, y: 380 },
            { x: 520, y: 380 },
            { x: 520, y: 180 },
            { x: 760, y: 180 },
            { x: 760, y: 440 },
            { x: 970, y: 440 }
        ],
        slots: [
            { id: "sm-1", x: 140, y: 80 },
            { id: "sm-2", x: 140, y: 230 },
            { id: "sm-3", x: 380, y: 300 },
            { id: "sm-4", x: 380, y: 460 },
            { id: "sm-5", x: 640, y: 110 },
            { id: "sm-6", x: 640, y: 260 },
            { id: "sm-7", x: 880, y: 360 },
            { id: "sm-8", x: 880, y: 510 }
        ],
        briefing: [
            {
                id: "bm-plasma",
                turretType: "plasma",
                turretName: "Арифмометр (Быстрая)",
                title: "1. Обыкновенные и десятичные дроби",
                content: "Чтобы сложить или вычесть дроби с разными знаменателями, их нужно привести к общему знаменателю. При делении дроби на дробь делимое умножается на перевернутую вторую дробь.",
                formula: "(a/b) : (c/d) = (a * d) / (b * c)"
            },
            {
                id: "bm-cryo",
                turretType: "cryo",
                turretName: "Крио-Процент (Замедляющая)",
                title: "2. Проценты и Пропорции",
                content: "Один процент — это одна сотая часть числа (1% = 0.01). Основное свойство пропорции: произведение крайних членов равно произведению средних членов (если a/b = c/d, то a*d = b*c).",
                formula: "P% от числа N = N * (P / 100)"
            },
            {
                id: "bm-artillery",
                turretType: "artillery",
                turretName: "Теорема Пифагора (AoE-Мортира)",
                title: "3. Прямоугольный треугольник и Пифагор",
                content: "В прямоугольном треугольнике квадрат длины гипотенузы равен сумме квадратов длин катетов. Площадь прямоугольного треугольника равна половине произведения катетов.",
                formula: "c² = a² + b² (a, b — катеты, c — гипотенуза)"
            },
            {
                id: "bm-super",
                turretType: "super",
                turretName: "Протокол «Супер-удар: Квадратное уравнение»",
                title: "4. Квадратные уравнения и Дискриминант",
                content: "Для уравнения ax² + bx + c = 0 дискриминант вычисляется по формуле D = b² - 4ac. Если D > 0 — два корня, если D = 0 — один корень, если D < 0 — действительных корней нет.",
                formula: "D = b² - 4ac; x = (-b ± √D) / (2a)"
            }
        ],
        waves: [
            {
                waveNumber: 1,
                name: "Разминка: Ошибки в устном счете",
                spawnInterval: 1400,
                enemies: [
                    { type: "scout", count: 8, hp: 55, speed: 1.45, rewardScore: 50, color: "#fde047", name: "Неправильная дробь" }
                ]
            },
            {
                waveNumber: 2,
                name: "Штурм: Сложные уравнения и дроби",
                spawnInterval: 1200,
                enemies: [
                    { type: "scout", count: 6, hp: 65, speed: 1.5, rewardScore: 60, color: "#fde047", name: "Минус перед скобкой" },
                    { type: "trooper", count: 8, hp: 120, speed: 1.05, rewardScore: 100, color: "#fb923c", name: "Квадратный корень" }
                ]
            },
            {
                waveNumber: 3,
                name: "Финальный Экзамен: ОГЭ / ЕГЭ",
                spawnInterval: 1100,
                enemies: [
                    { type: "trooper", count: 8, hp: 140, speed: 1.1, rewardScore: 110, color: "#fb923c", name: "Система уравнений" },
                    { type: "tank", count: 4, hp: 260, speed: 0.75, rewardScore: 180, color: "#f43f5e", name: "Тригонометрия" },
                    { type: "boss", count: 1, hp: 1050, speed: 0.55, rewardScore: 600, color: "#a855f7", isBoss: true, name: "Босс: Экзаменационный Тест" }
                ]
            }
        ],
        questions: [
            {
                id: "qm-1",
                difficulty: "easy",
                cardId: "bm-plasma",
                turretType: "plasma",
                question: "Чему равна сумма дробей: 1/4 + 2/4?",
                options: ["3/4", "3/8", "1/2", "2/4"],
                correctIndex: 0,
                explanation: "При сложении дробей с одинаковыми знаменателями складываются только числители: 1 + 2 = 3, знаменатель 4."
            },
            {
                id: "qm-2",
                difficulty: "easy",
                cardId: "bm-plasma",
                turretType: "plasma",
                question: "Чему равно произведение дробей: 3/5 * 5/3?",
                options: ["1", "15/15 = 2", "9/25", "0"],
                correctIndex: 0,
                explanation: "Взаимно обратные дроби при перемножении сокращаются и дают единицу."
            },
            {
                id: "qm-3",
                difficulty: "easy",
                cardId: "bm-plasma",
                turretType: "plasma",
                question: "Сколько процентов составляет число 25 от числа 100?",
                options: ["25%", "50%", "4%", "12.5%"],
                correctIndex: 0,
                explanation: "25 от 100 — это ровно четверть, то есть 25%."
            },
            {
                id: "qm-4",
                difficulty: "easy",
                cardId: "bm-plasma",
                turretType: "plasma",
                question: "Найдите корень уравнения: 2x + 6 = 16.",
                options: ["x = 5", "x = 8", "x = 10", "x = 4"],
                correctIndex: 0,
                explanation: "2x = 16 - 6 => 2x = 10 => x = 5."
            },
            {
                id: "qm-5",
                difficulty: "medium",
                cardId: "bm-cryo",
                turretType: "cryo",
                question: "Товар стоил 2000 рублей. Цену снизили на 15%. Какова новая цена?",
                options: ["1700 рублей", "1850 рублей", "1600 рублей", "1750 рублей"],
                correctIndex: 0,
                explanation: "Скидка: 2000 * 0.15 = 300 руб. Новая цена: 2000 - 300 = 1700 руб."
            },
            {
                id: "qm-6",
                difficulty: "medium",
                cardId: "bm-cryo",
                turretType: "cryo",
                question: "Решите пропорцию: x / 6 = 5 / 2. Чему равен x?",
                options: ["15", "12", "10", "30"],
                correctIndex: 0,
                explanation: "2x = 6 * 5 => 2x = 30 => x = 15."
            },
            {
                id: "qm-7",
                difficulty: "medium",
                cardId: "bm-artillery",
                turretType: "artillery",
                question: "Катеты прямоугольного треугольника равны 3 см и 4 см. Найдите гипотенузу.",
                options: ["5 см", "7 см", "6 см", "25 см"],
                correctIndex: 0,
                explanation: "По теореме Пифагора: c² = 3² + 4² = 25 => c = 5 см."
            },
            {
                id: "qm-8",
                difficulty: "medium",
                cardId: "bm-artillery",
                turretType: "artillery",
                question: "Чему равна площадь прямоугольника со сторонами 7 см и 8 см?",
                options: ["56 см²", "30 см²", "15 см²", "64 см²"],
                correctIndex: 0,
                explanation: "S = 7 * 8 = 56 см²."
            },
            {
                id: "qm-9",
                difficulty: "hard",
                cardId: "bm-super",
                turretType: "super",
                question: "Чему равен дискриминант квадратного уравнения: x² - 6x + 8 = 0?",
                options: ["4 (два корня)", "0 (один корень)", "16", "-4 (нет корней)"],
                correctIndex: 0,
                explanation: "D = (-6)² - 4 * 1 * 8 = 36 - 32 = 4."
            },
            {
                id: "qm-10",
                difficulty: "hard",
                cardId: "bm-super",
                turretType: "super",
                question: "Раскройте формулу разности квадратов: (a - b)(a + b) = ?",
                options: ["a² - b²", "a² + b²", "a² - 2ab + b²", "(a - b)²"],
                correctIndex: 0,
                explanation: "Произведение разности двух чисел на их сумму равно разности их квадратов."
            },
            {
                id: "qm-11",
                difficulty: "hard",
                cardId: "bm-artillery",
                turretType: "artillery",
                question: "Гипотенуза треугольника равна 10 см, один катет 6 см. Найдите второй катет.",
                options: ["8 см", "4 см", "64 см", "7 см"],
                correctIndex: 0,
                explanation: "b² = 10² - 6² = 64 => b = 8 см."
            },
            {
                id: "qm-12",
                difficulty: "hard",
                cardId: "bm-super",
                turretType: "super",
                question: "Чему равно значение выражения: 2⁵ * 2³ / 2⁶?",
                options: ["4 (2²)", "8", "2", "16"],
                correctIndex: 0,
                explanation: "Показатели степеней: 5 + 3 - 6 = 2 => 2² = 4."
            }
        ]
    },

    // ==========================================
    // 2. ФИЗИКА
    // ==========================================
    {
        id: "school-physics",
        title: "2. Физика: Законы Ньютона, Скорость и Ток",
        description: "Отразите физические аномалии! Используйте формулы движения, механику Ньютона, закон Ома и тепловые явления.",
        subjectIcon: "⚡",
        isCustom: false,
        path: [
            { x: 30, y: 320 },
            { x: 200, y: 320 },
            { x: 200, y: 120 },
            { x: 480, y: 120 },
            { x: 480, y: 460 },
            { x: 740, y: 460 },
            { x: 740, y: 220 },
            { x: 970, y: 220 }
        ],
        slots: [
            { id: "sp-1", x: 100, y: 220 },
            { id: "sp-2", x: 300, y: 200 },
            { id: "sp-3", x: 340, y: 60 },
            { id: "sp-4", x: 380, y: 360 },
            { id: "sp-5", x: 600, y: 280 },
            { id: "sp-6", x: 620, y: 530 },
            { id: "sp-7", x: 860, y: 140 },
            { id: "sp-8", x: 860, y: 320 }
        ],
        briefing: [
            {
                id: "bp-plasma",
                turretType: "plasma",
                turretName: "Кинематика (Быстрая)",
                title: "1. Равномерное движение: Скорость и Путь",
                content: "При равномерном прямолинейном движении скорость тела постоянна. Пройденный путь равен произведению скорости на время движения: S = v * t.",
                formula: "S = v * t; v = S / t; t = S / v"
            },
            {
                id: "bp-cryo",
                turretType: "cryo",
                turretName: "Гравитационный Замедлитель (Крио)",
                title: "2. Законы Ньютона и Сила тяжести",
                content: "Второй закон Ньютона: сила равна произведению массы тела на его ускорение (F = m * a). Сила тяжести у поверхности Земли: F = m * g (g ≈ 9.8 м/с²).",
                formula: "F = m * a; Fтяж = m * g"
            },
            {
                id: "bp-artillery",
                turretType: "artillery",
                turretName: "Закон Ома (AoE-Мортира)",
                title: "3. Электричество: Закон Ома",
                content: "Сила тока I прямо пропорциональна напряжению U и обратно пропорциональна сопротивлению R. Единицы: Ампер, Вольт, Ом.",
                formula: "I = U / R; U = I * R; R = U / I"
            },
            {
                id: "bp-super",
                turretType: "super",
                turretName: "Протокол «Супер-удар: Импульс и Энергия»",
                title: "4. Кинетическая энергия и Закон сохранения",
                content: "Кинетическая энергия движущегося тела равна половине произведения массы на квадрат скорости (Eк = m*v² / 2). Полная механическая энергия замкнутой системы сохраняется.",
                formula: "Eк = (m * v²) / 2; Eп = m * g * h"
            }
        ],
        waves: [
            {
                waveNumber: 1,
                name: "Волна 1: Кинематические частицы",
                spawnInterval: 1300,
                enemies: [
                    { type: "scout", count: 9, hp: 65, speed: 1.5, rewardScore: 50, color: "#22d3ee", name: "Фотон" }
                ]
            },
            {
                waveNumber: 2,
                name: "Волна 2: Электрический разряд",
                spawnInterval: 1100,
                enemies: [
                    { type: "scout", count: 6, hp: 75, speed: 1.55, rewardScore: 60, color: "#22d3ee", name: "Электрон" },
                    { type: "trooper", count: 9, hp: 140, speed: 1.1, rewardScore: 110, color: "#4ade80", name: "Магнитный вихрь" }
                ]
            },
            {
                waveNumber: 3,
                name: "Волна 3: Гравитационный коллапс",
                spawnInterval: 1000,
                enemies: [
                    { type: "trooper", count: 10, hp: 160, speed: 1.15, rewardScore: 120, color: "#4ade80", name: "Инерционный блок" },
                    { type: "tank", count: 5, hp: 320, speed: 0.8, rewardScore: 200, color: "#fb923c", name: "Свинцовый монолит" },
                    { type: "boss", count: 1, hp: 1350, speed: 0.5, rewardScore: 800, color: "#f43f5e", isBoss: true, name: "Босс: Гравитационная Аномалия" }
                ]
            }
        ],
        questions: [
            {
                id: "qp-1",
                difficulty: "easy",
                cardId: "bp-plasma",
                turretType: "plasma",
                question: "Автомобиль едет со скоростью 60 км/ч в течение 2 часов. Какой путь он проедет?",
                options: ["120 км", "30 км", "62 км", "180 км"],
                correctIndex: 0,
                explanation: "S = 60 * 2 = 120 км."
            },
            {
                id: "qp-2",
                difficulty: "easy",
                cardId: "bp-plasma",
                turretType: "plasma",
                question: "В каких единицах в Международной системе СИ измеряется сила?",
                options: ["В Ньютонах (Н)", "В Джоулях (Дж)", "В Паскалях (Па)", "В Ваттах (Вт)"],
                correctIndex: 0,
                explanation: "Сила измеряется в Ньютонах."
            },
            {
                id: "qp-3",
                difficulty: "easy",
                cardId: "bp-cryo",
                turretType: "cryo",
                question: "Чему примерно равно ускорение свободного падения (g) на Земле?",
                options: ["9.8 м/с²", "100 м/с²", "3.14 м/с²", "1.6 м/с²"],
                correctIndex: 0,
                explanation: "g ≈ 9.8 м/с²."
            },
            {
                id: "qp-4",
                difficulty: "easy",
                cardId: "bp-artillery",
                turretType: "artillery",
                question: "Напряжение в цепи 12 В, сопротивление 4 Ом. Какова сила тока (Закон Ома)?",
                options: ["3 А", "48 А", "0.33 А", "8 А"],
                correctIndex: 0,
                explanation: "I = 12 / 4 = 3 А."
            },
            {
                id: "qp-5",
                difficulty: "medium",
                cardId: "bp-cryo",
                turretType: "cryo",
                question: "Какая сила действует на тело массой 5 кг, если оно движется с ускорением 3 м/с²?",
                options: ["15 Н", "8 Н", "1.67 Н", "45 Н"],
                correctIndex: 0,
                explanation: "F = m * a = 5 * 3 = 15 Н."
            },
            {
                id: "qp-6",
                difficulty: "medium",
                cardId: "bp-artillery",
                turretType: "artillery",
                question: "Какое сопротивление имеет проводник, если при напряжении 220 В через него течет ток 2 А?",
                options: ["110 Ом", "440 Ом", "220 Ом", "55 Ом"],
                correctIndex: 0,
                explanation: "R = 220 / 2 = 110 Ом."
            },
            {
                id: "qp-7",
                difficulty: "medium",
                cardId: "bp-plasma",
                turretType: "plasma",
                question: "При какой температуре замерзает чистая вода при нормальном давлении?",
                options: ["0 °C", "-10 °C", "32 °C", "100 °C"],
                correctIndex: 0,
                explanation: "0 градусов Цельсия — точка кристаллизации воды."
            },
            {
                id: "qp-8",
                difficulty: "medium",
                cardId: "bp-cryo",
                turretType: "cryo",
                question: "В чем суть Первого закона Ньютона (закона инерции)?",
                options: [
                    "Тело сохраняет покой или равномерное прямолинейное движение, если на него не действуют силы",
                    "Действие равно противодействию",
                    "Сила равна произведению массы на ускорение",
                    "Энергия сохраняется"
                ],
                correctIndex: 0,
                explanation: "Первый закон Ньютона описывает явление инерции."
            },
            {
                id: "qp-9",
                difficulty: "hard",
                cardId: "bp-super",
                turretType: "super",
                question: "Тело массой 2 кг движется со скоростью 4 м/с. Чему равна кинетическая энергия?",
                options: ["16 Дж", "8 Дж", "32 Дж", "4 Дж"],
                correctIndex: 0,
                explanation: "E = (2 * 4²) / 2 = 16 Дж."
            },
            {
                id: "qp-10",
                difficulty: "hard",
                cardId: "bp-super",
                turretType: "super",
                question: "Какая формула описывает Третий закон Ньютона?",
                options: [
                    "F₁ = -F₂ (действие равно противодействию)",
                    "F = m * a",
                    "E = m * c²",
                    "P = F / S"
                ],
                correctIndex: 0,
                explanation: "F₁ = -F₂."
            },
            {
                id: "qp-11",
                difficulty: "hard",
                cardId: "bp-artillery",
                turretType: "artillery",
                question: "Как изменится сопротивление проводника, если его длину увеличить в 2 раза?",
                options: ["Увеличится в 2 раза", "Уменьшится в 2 раза", "Увеличится в 4 раза", "Не изменится"],
                correctIndex: 0,
                explanation: "R = ρ * l / S => прямо пропорционально длине."
            },
            {
                id: "qp-12",
                difficulty: "hard",
                cardId: "bp-super",
                turretType: "super",
                question: "Потенциальная энергия груза 3 кг на высоте 4 м (g = 10 м/с²):",
                options: ["120 Дж", "70 Дж", "12 Дж", "60 Дж"],
                correctIndex: 0,
                explanation: "E = 3 * 10 * 4 = 120 Дж."
            }
        ]
    },

    // ==========================================
    // 3. РУССКИЙ ЯЗЫК
    // ==========================================
    {
        id: "school-russian",
        title: "3. Русский язык: Орфография и Пунктуация",
        description: "Защитите грамотность от орфографических вирусов! Проверьте правописание корней, приставок, суффиксов и знаки препинания.",
        subjectIcon: "📖",
        isCustom: false,
        path: [
            { x: 30, y: 180 },
            { x: 320, y: 180 },
            { x: 320, y: 460 },
            { x: 620, y: 460 },
            { x: 620, y: 140 },
            { x: 840, y: 140 },
            { x: 840, y: 400 },
            { x: 970, y: 400 }
        ],
        slots: [
            { id: "sr-1", x: 180, y: 100 },
            { id: "sr-2", x: 180, y: 260 },
            { id: "sr-3", x: 470, y: 380 },
            { id: "sr-4", x: 470, y: 530 },
            { id: "sr-5", x: 730, y: 60 },
            { id: "sr-6", x: 730, y: 220 },
            { id: "sr-7", x: 730, y: 480 },
            { id: "sr-8", x: 920, y: 320 }
        ],
        briefing: [
            {
                id: "br-plasma",
                turretType: "plasma",
                turretName: "Орфограф (Быстрая)",
                title: "1. Безударные гласные в корне слова",
                content: "Чтобы проверить безударную гласную в корне, нужно изменить форму слова или подобрать однокоренное слово так, чтобы эта гласная оказалась под ударением (водá — вóды).",
                formula: "водá ➔ вóдный; положúть ➔ полагáть (суффикс -а-)"
            },
            {
                id: "br-cryo",
                turretType: "cryo",
                turretName: "Приставка-Стоп (Крио)",
                title: "2. Правописание приставок ПРЕ- и ПРИ-",
                content: "Приставка ПРИ- пишется в значениях: приближение, присоединение, неполнота действия, близость. Приставка ПРЕ- пишется в значении 'очень' или сходна с ПЕРЕ-.",
                formula: "ПРИехать (приближение), ПРЕдобрый (= очень добрый)"
            },
            {
                id: "br-artillery",
                turretType: "artillery",
                turretName: "Мортира НЕ с частями речи",
                title: "3. Слитное и раздельное написание НЕ",
                content: "НЕ с глаголами пишется раздельно. С существительными и прилагательными пишется слитно, если можно заменить синонимом (неправда = ложь), и раздельно при противопоставлении с союзом 'а'.",
                formula: "НЕ знал (глагол); неправда (=ложь); не правда, а ложь"
            },
            {
                id: "br-super",
                turretType: "super",
                turretName: "Протокол «Супер-удар: Синтаксис»",
                title: "4. Пунктуация в сложном предложении",
                content: "Перед союзами 'что', 'чтобы', 'потому что', 'который' всегда ставится запятая. В сложносочиненном предложении перед союзом 'и' ставится запятая между основами.",
                formula: "[Мы знали], (что урок начнется вовремя)."
            }
        ],
        waves: [
            {
                waveNumber: 1,
                name: "Волна 1: Опечатки и пропущенные буквы",
                spawnInterval: 1200,
                enemies: [
                    { type: "scout", count: 10, hp: 75, speed: 1.55, rewardScore: 60, color: "#f43f5e", name: "Опечатка" }
                ]
            },
            {
                waveNumber: 2,
                name: "Волна 2: Слитное или раздельное?",
                spawnInterval: 1050,
                enemies: [
                    { type: "scout", count: 8, hp: 85, speed: 1.6, rewardScore: 70, color: "#f43f5e", name: "Лишний пробел" },
                    { type: "trooper", count: 10, hp: 170, speed: 1.15, rewardScore: 130, color: "#c084fc", name: "Ошибка в ПРЕ/ПРИ" }
                ]
            },
            {
                waveNumber: 3,
                name: "Волна 3: Диктант повышенной сложности",
                spawnInterval: 950,
                enemies: [
                    { type: "trooper", count: 12, hp: 190, speed: 1.2, rewardScore: 140, color: "#c084fc", name: "Пропущенная запятая" },
                    { type: "tank", count: 6, hp: 380, speed: 0.8, rewardScore: 240, color: "#fb923c", name: "Словарное слово" },
                    { type: "boss", count: 1, hp: 1650, speed: 0.48, rewardScore: 1000, color: "#fde047", isBoss: true, name: "Босс: Орфографический Хаос" }
                ]
            }
        ],
        questions: [
            {
                id: "qr-1",
                difficulty: "easy",
                cardId: "br-plasma",
                turretType: "plasma",
                question: "В каком слове на месте пропуска пишется буква 'О'?",
                options: ["Г...ра (проверочное: горы)", "Тр...ва (проверочное: травы)", "С...ды (проверочное: сад)", "В...да (проверочное: воды)"],
                correctIndex: 0,
                explanation: "Гора — проверочное слово 'горы'."
            },
            {
                id: "qr-2",
                difficulty: "easy",
                cardId: "br-artillery",
                turretType: "artillery",
                question: "Как правильно пишется: (не)был на уроке?",
                options: ["Не был (раздельно)", "Небыл (слитно)", "Ни был", "Не-был"],
                correctIndex: 0,
                explanation: "НЕ с глаголами пишется раздельно."
            },
            {
                id: "qr-3",
                difficulty: "easy",
                cardId: "br-plasma",
                turretType: "plasma",
                question: "Какое слово является именем существительным?",
                options: ["Книга", "Быстрый", "Бежать", "Весело"],
                correctIndex: 0,
                explanation: "'Книга' отвечает на вопрос 'что?' и обозначает предмет."
            },
            {
                id: "qr-4",
                difficulty: "easy",
                cardId: "br-cryo",
                turretType: "cryo",
                question: "В каком слове пишется приставка ПРИ-?",
                options: [
                    "Пр...ехать (значение приближения)",
                    "Пр...мудрый",
                    "Пр...красный",
                    "Пр...градить"
                ],
                correctIndex: 0,
                explanation: "Приехать — значение приближения."
            },
            {
                id: "qr-5",
                difficulty: "medium",
                cardId: "br-cryo",
                turretType: "cryo",
                question: "В каком слове пишется приставка ПРЕ-?",
                options: [
                    "Пр...милый (= очень милый)",
                    "Пр...шить пуговицу",
                    "Пр...брежный",
                    "Пр...открыть"
                ],
                correctIndex: 0,
                explanation: "Премилый означает 'очень милый'."
            },
            {
                id: "qr-6",
                difficulty: "medium",
                cardId: "br-artillery",
                turretType: "artillery",
                question: "В каком варианте НЕ пишется слитно?",
                options: [
                    "Неправда (синоним: ложь)",
                    "Не читал",
                    "Не правда, а обман",
                    "Вовсе не красивый"
                ],
                correctIndex: 0,
                explanation: "'Неправда' заменяется синонимом 'ложь' без противопоставления."
            },
            {
                id: "qr-7",
                difficulty: "medium",
                cardId: "br-super",
                turretType: "super",
                question: "Где нужна запятая: 'Солнце село (1) и на небе зажглись первые звезды (2)'?",
                options: ["Только на месте (1)", "На месте (1) и (2)", "Запятые не нужны", "Только на месте (2)"],
                correctIndex: 0,
                explanation: "Сложносочиненное предложение с двумя основами."
            },
            {
                id: "qr-8",
                difficulty: "medium",
                cardId: "br-plasma",
                turretType: "plasma",
                question: "В каком слове пишется буква 'И' в корне с чередованием?",
                options: ["Соб...рать (есть суффикс -А-)", "Соб...ру", "Зап...реть", "Бл...стеть"],
                correctIndex: 0,
                explanation: "В корне бер/бир пишется И перед суффиксом -А-."
            },
            {
                id: "qr-9",
                difficulty: "hard",
                cardId: "br-super",
                turretType: "super",
                question: "Укажите верное написание: 'мыш...нок'. Какая буква пропущена?",
                options: ["О (мышонок)", "Ё", "Е", "А"],
                correctIndex: 0,
                explanation: "Под ударением в суффиксе -онок- после шипящих пишется О."
            },
            {
                id: "qr-10",
                difficulty: "hard",
                cardId: "br-artillery",
                turretType: "artillery",
                question: "В каком случае НЕ пишется раздельно?",
                options: [
                    "Никому (не)известный автор",
                    "Небрежный",
                    "Невысокий",
                    "Несчастье"
                ],
                correctIndex: 0,
                explanation: "Наличие отрицательного местоимения с ни- влечет раздельное написание."
            },
            {
                id: "qr-11",
                difficulty: "hard",
                cardId: "br-super",
                turretType: "super",
                question: "Какое слово пишется с двумя буквами 'НН'?",
                options: ["Стекля...ый (исключение)", "Кожа...ый", "Песча...ый", "Ю...ый"],
                correctIndex: 0,
                explanation: "Стеклянный, оловянный, деревянный — слова-исключения с -янн-."
            },
            {
                id: "qr-12",
                difficulty: "hard",
                cardId: "br-super",
                turretType: "super",
                question: "Грамматическая основа в предложении: 'В саду громко пели лесные птицы'?",
                options: ["Птицы пели", "Пели лесные", "Пели в саду", "Птицы лесные"],
                correctIndex: 0,
                explanation: "Подлежащее: птицы, сказуемое: пели."
            }
        ]
    },

    // ==========================================
    // 4. БИОЛОГИЯ И АНАТОМИЯ
    // ==========================================
    {
        id: "school-biology",
        title: "4. Биология: Клетка, Фотосинтез и Человек",
        description: "Изучите живые системы! Защитите биосферу, применив знания о строении клетки, кровеносной системе, фотосинтезе и ДНК.",
        subjectIcon: "🧬",
        isCustom: false,
        path: [
            { x: 30, y: 150 },
            { x: 260, y: 150 },
            { x: 260, y: 380 },
            { x: 520, y: 380 },
            { x: 520, y: 180 },
            { x: 760, y: 180 },
            { x: 760, y: 440 },
            { x: 970, y: 440 }
        ],
        slots: [
            { id: "sb-1", x: 140, y: 80 },
            { id: "sb-2", x: 140, y: 230 },
            { id: "sb-3", x: 380, y: 300 },
            { id: "sb-4", x: 380, y: 460 },
            { id: "sb-5", x: 640, y: 110 },
            { id: "sb-6", x: 640, y: 260 },
            { id: "sb-7", x: 880, y: 360 },
            { id: "sb-8", x: 880, y: 510 }
        ],
        briefing: [
            {
                id: "bb-plasma",
                turretType: "plasma",
                turretName: "Цито-Пушка (Быстрая)",
                title: "1. Строение клетки и Органеллы",
                content: "Клетка — основная единица живого. Ядро хранит генетическую информацию. Митохондрии вырабатывают энергию АТФ ('электростанции клетки'). Растительные клетки имеют хлоропласты и клеточную стенку из целлюлозы.",
                formula: "Ядро (ДНК) ➔ Митохондрии (АТФ) ➔ Рибосомы (Синтез белка)"
            },
            {
                id: "bb-cryo",
                turretType: "cryo",
                turretName: "Хлорофилл-Крио (Замедляющая)",
                title: "2. Фотосинтез и Дыхание",
                content: "Фотосинтез происходит в хлоропластах на свету: растения поглощают углекислый газ и воду, выделяя кислород и синтезируя глюкозу.",
                formula: "6CO₂ + 6H₂O + свет ➔ C₆H₁₂O₆ (глюкоза) + 6O₂"
            },
            {
                id: "bb-artillery",
                turretType: "artillery",
                turretName: "Кардио-Мортира (AoE-Урон)",
                title: "3. Кровеносная система человека",
                content: "Сердце человека четырехкамерное: 2 предсердия и 2 желудочка. Большой круг кровообращения снабжает все тело, малый (легочный) круг обогащает кровь кислородом в легких.",
                formula: "Левый желудочек ➔ Аорта (Большой круг); Правый желудочек ➔ Легкие (Малый круг)"
            },
            {
                id: "bb-super",
                turretType: "super",
                turretName: "Протокол «Супер-удар: ДНК и Генетика»",
                title: "4. ДНК и Принцип комплементарности",
                content: "ДНК представляет собой двойную спираль из нуклеотидов. Азотистые основания соединяются строго попарно: Аденин с Тимином (А-Т), Гуанин с Цитозином (Г-Ц).",
                formula: "Правило Чаргаффа: А = Т; Г = Ц"
            }
        ],
        waves: [
            {
                waveNumber: 1,
                name: "Волна 1: Одноклеточные бактерии",
                spawnInterval: 1300,
                enemies: [
                    { type: "scout", count: 8, hp: 60, speed: 1.5, rewardScore: 50, color: "#4ade80", name: "Бактерия" }
                ]
            },
            {
                waveNumber: 2,
                name: "Волна 2: Патогенные споры",
                spawnInterval: 1150,
                enemies: [
                    { type: "scout", count: 6, hp: 70, speed: 1.55, rewardScore: 60, color: "#4ade80", name: "Вирион" },
                    { type: "trooper", count: 8, hp: 130, speed: 1.1, rewardScore: 110, color: "#22d3ee", name: "Паразит" }
                ]
            },
            {
                waveNumber: 3,
                name: "Волна 3: Биологическая мутация",
                spawnInterval: 1000,
                enemies: [
                    { type: "trooper", count: 10, hp: 150, speed: 1.15, rewardScore: 120, color: "#22d3ee", name: "Токсичный штамм" },
                    { type: "tank", count: 4, hp: 300, speed: 0.8, rewardScore: 200, color: "#f43f5e", name: "Саркома" },
                    { type: "boss", count: 1, hp: 1250, speed: 0.52, rewardScore: 750, color: "#a855f7", isBoss: true, name: "Босс: Супер-Вирус Мутант" }
                ]
            }
        ],
        questions: [
            {
                id: "qb-1",
                difficulty: "easy",
                cardId: "bb-plasma",
                turretType: "plasma",
                question: "Какая органелла вырабатывает энергию АТФ ('электростанция клетки')?",
                options: ["Митохондрия", "Рибосома", "Вакуоль", "Лизосома"],
                correctIndex: 0,
                explanation: "Митохондрии обеспечивают клеточное дыхание и синтез молекул АТФ."
            },
            {
                id: "qb-2",
                difficulty: "easy",
                cardId: "bb-plasma",
                turretType: "plasma",
                question: "Где в клетке хранится основная наследственная информация (ДНК)?",
                options: ["В ядре", "В цитоплазме", "В оболочке", "В комплексе Гольджи"],
                correctIndex: 0,
                explanation: "В ядре эукариотической клетки упакованы хромосомы, состоящие из молекул ДНК."
            },
            {
                id: "qb-3",
                difficulty: "easy",
                cardId: "bb-cryo",
                turretType: "cryo",
                question: "Какой газ выделяют растения в процессе фотосинтеза на свету?",
                options: ["Кислород (O₂)", "Углекислый газ (CO₂)", "Азот (N₂)", "Водород (H₂)"],
                correctIndex: 0,
                explanation: "При фотосинтезе растения расщепляют воду и выделяют свободный кислород."
            },
            {
                id: "qb-4",
                difficulty: "easy",
                cardId: "bb-artillery",
                turretType: "artillery",
                question: "Сколько камер имеет сердце взрослого человека?",
                options: ["4 камеры", "2 камеры", "3 камеры", "1 камера"],
                correctIndex: 0,
                explanation: "Сердце человека состоит из 4 камер: правое и левое предсердия, правый и левый желудочки."
            },
            {
                id: "qb-5",
                difficulty: "medium",
                cardId: "bb-plasma",
                turretType: "plasma",
                question: "Какое вещество входит в состав клеточной стенки растительной клетки?",
                options: ["Целлюлоза (клетчатка)", "Хитин", "Гликоген", "Муреин"],
                correctIndex: 0,
                explanation: "Клеточная стенка растений состоит из целлюлозы. Хитин — у грибов и членистоногих."
            },
            {
                id: "qb-6",
                difficulty: "medium",
                cardId: "bb-artillery",
                turretType: "artillery",
                question: "Какие сосуды несут кровь ОТ сердца к органам и тканям?",
                options: ["Артерии", "Вены", "Капилляры", "Лимфатические сосуды"],
                correctIndex: 0,
                explanation: "Артерии несут кровь от сердца. Вены — обратно к сердцу."
            },
            {
                id: "qb-7",
                difficulty: "medium",
                cardId: "bb-cryo",
                turretType: "cryo",
                question: "Какой зеленый пигмент поглощает энергию солнечного света в листьях?",
                options: ["Хлорофилл", "Гемоглобин", "Меланин", "Каротин"],
                correctIndex: 0,
                explanation: "Хлорофилл расположен в хлоропластах и поглощает солнечный свет."
            },
            {
                id: "qb-8",
                difficulty: "medium",
                cardId: "bb-super",
                turretType: "super",
                question: "Какое азотистое основание в ДНК комплементарно Аденину (А)?",
                options: ["Тимин (Т)", "Гуанин (Г)", "Цитозин (Ц)", "Урацил (У)"],
                correctIndex: 0,
                explanation: "В ДНК Аденин всегда соединяется с Тимином (А-Т двумя водородными связями)."
            },
            {
                id: "qb-9",
                difficulty: "hard",
                cardId: "bb-artillery",
                turretType: "artillery",
                question: "Из какой камеры сердца начинается большой круг кровообращения?",
                options: ["Из левого желудочка", "Из правого желудочка", "Из правого предсердия", "Из левого предсердия"],
                correctIndex: 0,
                explanation: "Большой круг начинается из мощного левого желудочка, выталкивающего артериальную кровь в аорту."
            },
            {
                id: "qb-10",
                difficulty: "hard",
                cardId: "bb-super",
                turretType: "super",
                question: "Если в цепочке ДНК 30% Гуанина (Г), сколько процентов Цитозина (Ц) в ней содержится?",
                options: ["30%", "20%", "40%", "70%"],
                correctIndex: 0,
                explanation: "По правилу Чаргаффа Г = Ц, следовательно Цитозина тоже ровно 30%."
            },
            {
                id: "qb-11",
                difficulty: "hard",
                cardId: "bb-plasma",
                turretType: "plasma",
                question: "На каких органеллах клетки происходит биосинтез белка?",
                options: ["На рибосомах", "В лизосомах", "В центриолях", "В вакуолях"],
                correctIndex: 0,
                explanation: "Рибосомы считывают информацию с иРНК и собирают полипептидную цепочку белка."
            },
            {
                id: "qb-12",
                difficulty: "hard",
                cardId: "bb-super",
                turretType: "super",
                question: "Какие клетки крови отвечают за перенос кислорода с помощью гемоглобина?",
                options: ["Эритроциты", "Лейкоциты", "Тромбоциты", "Фагоциты"],
                correctIndex: 0,
                explanation: "Эритроциты (красные кровяные тельца) содержат белок гемоглобин и транспортируют O₂."
            }
        ]
    },

    // ==========================================
    // 5. ГЕОГРАФИЯ
    // ==========================================
    {
        id: "school-geography",
        title: "5. География: Материки, Океаны и Климат",
        description: "Исследуйте планету Земля! Примените географические координаты, знания океанов, литосферных плит и климатических поясов.",
        subjectIcon: "🌍",
        isCustom: false,
        path: [
            { x: 30, y: 320 },
            { x: 200, y: 320 },
            { x: 200, y: 120 },
            { x: 480, y: 120 },
            { x: 480, y: 460 },
            { x: 740, y: 460 },
            { x: 740, y: 220 },
            { x: 970, y: 220 }
        ],
        slots: [
            { id: "sg-1", x: 100, y: 220 },
            { id: "sg-2", x: 300, y: 200 },
            { id: "sg-3", x: 340, y: 60 },
            { id: "sg-4", x: 380, y: 360 },
            { id: "sg-5", x: 600, y: 280 },
            { id: "sg-6", x: 620, y: 530 },
            { id: "sg-7", x: 860, y: 140 },
            { id: "sg-8", x: 860, y: 320 }
        ],
        briefing: [
            {
                id: "bg-plasma",
                turretType: "plasma",
                turretName: "Компас (Быстрая)",
                title: "1. Материки и Мировой Океан",
                content: "На Земле 6 материков: Евразия (крупнейший), Африка, Северная Америка, Южная Америка, Антарктида, Австралия (самый сухой/маленький). Мировой океан объединяет 4 (или 5) океанов; Тихий океан — самый глубокий и большой.",
                formula: "Самый глубокий желоб: Марианская впадина (~11 022 м)"
            },
            {
                id: "bg-cryo",
                turretType: "cryo",
                turretName: "Гляцио-Замедлитель (Крио)",
                title: "2. Географические координаты",
                content: "Широта отсчитывается от экватора (0°) к северу (с.ш.) и югу (ю.ш.) до 90°. Долгота отсчитывается от нулевого Гринвичского меридиана к востоку (в.д.) и западу (з.д.) до 180°.",
                formula: "Экватор = 0° широты; Гринвич = 0° долготы"
            },
            {
                id: "bg-artillery",
                turretType: "artillery",
                turretName: "Тектоник-Мортира (AoE-Урон)",
                title: "3. Литосфера и Внутреннее строение Земли",
                content: "Земля состоит из земной коры, мантии и ядра. Литосфера разбита на тектонические плиты, движение которых вызывает землетрясения, горообразование и извержения вулканов.",
                formula: "Кора ➔ Мантия ➔ Внешнее жидкое ядро ➔ Внутреннее твердое ядро"
            },
            {
                id: "bg-super",
                turretType: "super",
                turretName: "Протокол «Супер-удар: Атмосфера и Циклон»",
                title: "4. Атмосфера и Давление",
                content: "Нижний слой атмосферы — тропосфера (в ней формируется погода). Ветер дует из области высокого атмосферного давления в область низкого давления. Циклон — вихрь с низким давлением в центре.",
                formula: "Ветер: P (высокое) ➔ P (низкое)"
            }
        ],
        waves: [
            {
                waveNumber: 1,
                name: "Волна 1: Океанические течения",
                spawnInterval: 1300,
                enemies: [
                    { type: "scout", count: 9, hp: 65, speed: 1.5, rewardScore: 50, color: "#22d3ee", name: "Муссон" }
                ]
            },
            {
                waveNumber: 2,
                name: "Волна 2: Сейсмический толчок",
                spawnInterval: 1100,
                enemies: [
                    { type: "scout", count: 6, hp: 75, speed: 1.55, rewardScore: 60, color: "#22d3ee", name: "Тайфун" },
                    { type: "trooper", count: 9, hp: 140, speed: 1.1, rewardScore: 110, color: "#fb923c", name: "Магматический сгусток" }
                ]
            },
            {
                waveNumber: 3,
                name: "Волна 3: Природный катаклизм",
                spawnInterval: 1000,
                enemies: [
                    { type: "trooper", count: 10, hp: 160, speed: 1.15, rewardScore: 120, color: "#fb923c", name: "Пепловый шторм" },
                    { type: "tank", count: 5, hp: 320, speed: 0.8, rewardScore: 200, color: "#f43f5e", name: "Литосферная плита" },
                    { type: "boss", count: 1, hp: 1350, speed: 0.5, rewardScore: 800, color: "#c084fc", isBoss: true, name: "Босс: Тектонический Разлом" }
                ]
            }
        ],
        questions: [
            {
                id: "qg-1",
                difficulty: "easy",
                cardId: "bg-plasma",
                turretType: "plasma",
                question: "Какой океан является самым большим и глубоким на Земле?",
                options: ["Тихий океан", "Атлантический океан", "Индийский океан", "Северный Ледовитый"],
                correctIndex: 0,
                explanation: "Тихий океан занимает почти половину площади Мирового океана и содержит Марианскую впадину."
            },
            {
                id: "qg-2",
                difficulty: "easy",
                cardId: "bg-plasma",
                turretType: "plasma",
                question: "Какой материк является самым большим по площади на планете?",
                options: ["Евразия", "Африка", "Северная Америка", "Антарктида"],
                correctIndex: 0,
                explanation: "Евразия — крупнейший материк, занимающий более 54 млн км²."
            },
            {
                id: "qg-3",
                difficulty: "easy",
                cardId: "bg-cryo",
                turretType: "cryo",
                question: "Какая линия делит земной шар на Северное и Южное полушария?",
                options: ["Экватор", "Гринвичский меридиан", "Северный тропик", "Полярный круг"],
                correctIndex: 0,
                explanation: "Экватор имеет широту 0° и разделяет планету на Северное и Южное полушария."
            },
            {
                id: "qg-4",
                difficulty: "easy",
                cardId: "bg-artillery",
                turretType: "artillery",
                question: "Какая самая высокая горная вершина на Земле (8848 м)?",
                options: ["Эверест (Джомолунгма)", "Эльбрус", "Килиманджаро", "Монблан"],
                correctIndex: 0,
                explanation: "Эверест в Гималаях — высочайшая точка планеты над уровнем моря."
            },
            {
                id: "qg-5",
                difficulty: "medium",
                cardId: "bg-super",
                turretType: "super",
                question: "В каком нижнем слое атмосферы сосредоточена почти вся погода и облака?",
                options: ["Тропосфера", "Стратосфера", "Мезосфера", "Ионосфера"],
                correctIndex: 0,
                explanation: "Тропосфера прилегает к поверхности Земли и содержит около 80% массы воздуха."
            },
            {
                id: "qg-6",
                difficulty: "medium",
                cardId: "bg-plasma",
                turretType: "plasma",
                question: "Какой материк является самым сухим и самым маленьким?",
                options: ["Австралия", "Антарктида", "Африка", "Южная Америка"],
                correctIndex: 0,
                explanation: "Австралия — наименьший по площади материк Земли."
            },
            {
                id: "qg-7",
                difficulty: "medium",
                cardId: "bg-super",
                turretType: "super",
                question: "Куда дует ветер согласно законам физики атмосферы?",
                options: ["Из области высокого давления в область низкого", "Из области низкого в область высокого", "Строго с запада на восток", "Всегда к экватору"],
                correctIndex: 0,
                explanation: "Воздух перемещается из зоны повышенного давления туда, где давление ниже."
            },
            {
                id: "qg-8",
                difficulty: "medium",
                cardId: "bg-artillery",
                turretType: "artillery",
                question: "Какое самое глубокое пресноводное озеро в мире?",
                options: ["Байкал", "Виктория", "Верхнее", "Каспийское море"],
                correctIndex: 0,
                explanation: "Озеро Байкал в России имеет глубину до 1642 м и хранит 20% мировых запасов озерной пресной воды."
            },
            {
                id: "qg-9",
                difficulty: "hard",
                cardId: "bg-cryo",
                turretType: "cryo",
                question: "Через какой город в Англии проходит нулевой (начальный) меридиан?",
                options: ["Гринвич (Лондон)", "Париж", "Оксфорд", "Ливерпуль"],
                correctIndex: 0,
                explanation: "Гринвичский меридиан (0° долготы) проходит через Гринвичскую королевскую обсерваторию."
            },
            {
                id: "qg-10",
                difficulty: "hard",
                cardId: "bg-super",
                turretType: "super",
                question: "Что представляет собой атмосферный Циклон в Северном полушарии?",
                options: [
                    "Вихрь с низким давлением в центре и движением воздуха против часовой стрелки",
                    "Область высокого давления с ясной погодой",
                    "Нисходящий поток холодного воздуха",
                    "Теплое океаническое течение"
                ],
                correctIndex: 0,
                explanation: "Циклон — атмосферный вихрь с минимумом давления в центре."
            },
            {
                id: "qg-11",
                difficulty: "hard",
                cardId: "bg-artillery",
                turretType: "artillery",
                question: "Как называется гигантский древний суперконтинент, объединявший всю сушу Земли?",
                options: ["Пангея", "Лавразия", "Гондвана", "Тетис"],
                correctIndex: 0,
                explanation: "Около 250 млн лет назад все материки составляли единый суперконтинент Пангею."
            },
            {
                id: "qg-12",
                difficulty: "hard",
                cardId: "bg-plasma",
                turretType: "plasma",
                question: "Какая река считается самой полноводной в мире?",
                options: ["Амазонка", "Нил", "Янцзы", "Миссисипи"],
                correctIndex: 0,
                explanation: "Амазонка в Южной Америке — самая полноводная река планеты."
            }
        ]
    },

    // ==========================================
    // 6. ИСТОРИЯ
    // ==========================================
    {
        id: "school-history",
        title: "6. История: Древний Мир и Эпохи",
        description: "Путешествуйте сквозь века! Защитите историческую хронологию от пирамид Египта до Руси и Великих открытий.",
        subjectIcon: "📜",
        isCustom: false,
        path: [
            { x: 30, y: 180 },
            { x: 320, y: 180 },
            { x: 320, y: 460 },
            { x: 620, y: 460 },
            { x: 620, y: 140 },
            { x: 840, y: 140 },
            { x: 840, y: 400 },
            { x: 970, y: 400 }
        ],
        slots: [
            { id: "sh-1", x: 180, y: 100 },
            { id: "sh-2", x: 180, y: 260 },
            { id: "sh-3", x: 470, y: 380 },
            { id: "sh-4", x: 470, y: 530 },
            { id: "sh-5", x: 730, y: 60 },
            { id: "sh-6", x: 730, y: 220 },
            { id: "sh-7", x: 730, y: 480 },
            { id: "sh-8", x: 920, y: 320 }
        ],
        briefing: [
            {
                id: "bh-plasma",
                turretType: "plasma",
                turretName: "Хронограф (Быстрая)",
                title: "1. Древний Восток и Египет",
                content: "Первые цивилизации зародились в долинах рек: Нил (Египет), Тигр и Евфрат (Месопотамия). Фараоны строили монументальные пирамиды, а в Вавилоне царь Хаммурапи создал один из первых писаных сводов законов.",
                formula: "Законы Хаммурапи (~1750 г. до н.э.): 'Око за око, зуб за зуб'"
            },
            {
                id: "bh-cryo",
                turretType: "cryo",
                turretName: "Фаланга-Крио (Замедляющая)",
                title: "2. Древняя Греция и Рим",
                content: "Греция состояла из городов-государств (полисов): демократические Афины и военная Спарта. Рим прошел путь от Царства и Республики до гигантской Империи с Сенатом, легионами и римским правом.",
                formula: "753 г. до н.э. — Основание Рима; 476 г. н.э. — Падение Западного Рима"
            },
            {
                id: "bh-artillery",
                turretType: "artillery",
                turretName: "Дружина (AoE-Мортира)",
                title: "3. Образование Древнерусского государства",
                content: "862 год — легендарное призвание варягов во главе с Рюриком в Новгород. В 882 году князь Олег объединил Новгород и Киев. В 988 году князь Владимир Святославич крестил Русь.",
                formula: "862 г. (Рюрик) ➔ 882 г. (Олег объединил Киев) ➔ 988 г. (Крещение Руси)"
            },
            {
                id: "bh-super",
                turretType: "super",
                turretName: "Протокол «Супер-удар: Великие Открытия»",
                title: "4. Эпоха Великих Географических Открытий",
                content: "В 1492 году Христофор Колумб открыл Америку, пытаясь найти морской путь в Индию. В 1519–1522 годах экспедиция Фернана Магеллана совершила первое кругосветное путешествие, доказав шарообразность Земли.",
                formula: "1492 г. — Колумб открыл Америку; 1519–1522 гг. — Плавание Магеллана"
            }
        ],
        waves: [
            {
                waveNumber: 1,
                name: "Волна 1: Воины Древности",
                spawnInterval: 1200,
                enemies: [
                    { type: "scout", count: 10, hp: 75, speed: 1.55, rewardScore: 60, color: "#fde047", name: "Колесница" }
                ]
            },
            {
                waveNumber: 2,
                name: "Волна 2: Легионы и Рыцари",
                spawnInterval: 1050,
                enemies: [
                    { type: "scout", count: 8, hp: 85, speed: 1.6, rewardScore: 70, color: "#fde047", name: "Гладиатор" },
                    { type: "trooper", count: 10, hp: 170, speed: 1.15, rewardScore: 130, color: "#fb923c", name: "Римский Легионер" }
                ]
            },
            {
                waveNumber: 3,
                name: "Волна 3: Временной Разлом",
                spawnInterval: 950,
                enemies: [
                    { type: "trooper", count: 12, hp: 190, speed: 1.2, rewardScore: 140, color: "#fb923c", name: "Тевтонский Рыцарь" },
                    { type: "tank", count: 6, hp: 380, speed: 0.8, rewardScore: 240, color: "#f43f5e", name: "Осадная Башня" },
                    { type: "boss", count: 1, hp: 1650, speed: 0.48, rewardScore: 1000, color: "#c084fc", isBoss: true, name: "Босс: Хронологический Парадокс" }
                ]
            }
        ],
        questions: [
            {
                id: "qh-1",
                difficulty: "easy",
                cardId: "bh-plasma",
                turretType: "plasma",
                question: "В долине какой великой реки возникла цивилизация Древнего Египта?",
                options: ["Нил", "Тигр", "Хуанхэ", "Ганг"],
                correctIndex: 0,
                explanation: "Цивилизация Египта развивалась вдоль берегов реки Нил."
            },
            {
                id: "qh-2",
                difficulty: "easy",
                cardId: "bh-artillery",
                turretType: "artillery",
                question: "В каком году князь Владимир крестил Древнюю Русь?",
                options: ["В 988 году", "В 862 году", "В 1147 году", "В 1242 году"],
                correctIndex: 0,
                explanation: "Крещение Руси состоялось в 988 году при князе Владимире."
            },
            {
                id: "qh-3",
                difficulty: "easy",
                cardId: "bh-super",
                turretType: "super",
                question: "В каком году Христофор Колумб открыл берега Америки?",
                options: ["1492 год", "1519 год", "1380 год", "1703 год"],
                correctIndex: 0,
                explanation: "Экспедиция Колумба достигла островов Карибского бассейна в 1492 году."
            },
            {
                id: "qh-4",
                difficulty: "easy",
                cardId: "bh-cryo",
                turretType: "cryo",
                question: "Какой греческий полис славился суровым военным воспитанием граждан?",
                options: ["Спарта", "Афины", "Коринф", "Фивы"],
                correctIndex: 0,
                explanation: "Спарта была полисом с воинским укладом и спартанским воспитанием."
            },
            {
                id: "qh-5",
                difficulty: "medium",
                cardId: "bh-plasma",
                turretType: "plasma",
                question: "Какой вавилонский царь создал один из древнейших сводов писаных законов?",
                options: ["Хаммурапи", "Навуходоносор", "Кир Великий", "Рамзес II"],
                correctIndex: 0,
                explanation: "Законы царя Хаммурапи были высечены на черном базальтовом столбе."
            },
            {
                id: "qh-6",
                difficulty: "medium",
                cardId: "bh-cryo",
                turretType: "cryo",
                question: "Какой знаменитый полководец перешел реку Рубикон и установил единоличную власть в Риме?",
                options: ["Юлий Цезарь", "Александр Македонский", "Ганнибал", "Нерон"],
                correctIndex: 0,
                explanation: "Юлий Цезарь в 49 г. до н.э. перешел Рубикон со словами 'Жребий брошен!'."
            },
            {
                id: "qh-7",
                difficulty: "medium",
                cardId: "bh-artillery",
                turretType: "artillery",
                question: "Какое событие в летописи 'Повесть временных лет' датируется 862 годом?",
                options: ["Призвание варягов (Рюрика)", "Ледовое побоище", "Куликовская битва", "Основание Москвы"],
                correctIndex: 0,
                explanation: "862 год считается датой зарождения российской государственности (призвание Рюрика)."
            },
            {
                id: "qh-8",
                difficulty: "medium",
                cardId: "bh-super",
                turretType: "super",
                question: "Чья экспедиция впервые в истории совершила кругосветное плавание (1519–1522 гг.)?",
                options: ["Фернана Магеллана", "Васко да Гамы", "Марко Поло", "Джеймса Кука"],
                correctIndex: 0,
                explanation: "Испанская экспедиция под руководством Магеллана (завершена Элькано) обогнула Землю."
            },
            {
                id: "qh-9",
                difficulty: "hard",
                cardId: "bh-artillery",
                turretType: "artillery",
                question: "В каком году князь Олег объединил Новгород и Киев под своей властью?",
                options: ["882 год", "862 год", "911 год", "988 год"],
                correctIndex: 0,
                explanation: "В 882 году князь Олег захватил Киев и объявил его 'матерью городов русских'."
            },
            {
                id: "qh-10",
                difficulty: "hard",
                cardId: "bh-cryo",
                turretType: "cryo",
                question: "Падение какого города в 476 году нашей эры ознаменовало конец Древнего мира и начало Средневековья?",
                options: ["Рима (Западной Римской империи)", "Константинополя", "Афин", "Карфагена"],
                correctIndex: 0,
                explanation: "Низложение императора Ромула Августула германцем Одоакром в 476 г."
            },
            {
                id: "qh-11",
                difficulty: "hard",
                cardId: "bh-artillery",
                turretType: "artillery",
                question: "В каком году новгородский князь Александр Невский разбил крестоносцев на Чудском озере?",
                options: ["1242 год (Ледовое побоище)", "1240 год", "1380 год", "1147 год"],
                correctIndex: 0,
                explanation: "Битва на льду Чудского озера произошла 5 апреля 1242 года."
            },
            {
                id: "qh-12",
                difficulty: "hard",
                cardId: "bh-super",
                turretType: "super",
                question: "Какой португальский мореплаватель первым обогнул Африку и достиг Индии морским путем (1498 г.)?",
                options: ["Васко да Гама", "Бартоломеу Диаш", "Христофор Колумб", "Америго Веспуччи"],
                correctIndex: 0,
                explanation: "Васко да Гама прибыл в индийский порт Каликут в 1498 году."
            }
        ]
    },
    // ==========================================
    // 7. ХИМИЯ: ЭЛЕМЕНТЫ, РЕАКЦИИ И КИСЛОТЫ
    // ==========================================
    {
        id: "school-chem",
        title: "7. Химия: Таблица Менделеева, Кислоты и Реакции",
        description: "Защитите лабораторию от токсичных химических соединений! Примените знания о валентности, периодическом законе, индикаторах и реакциях обмена.",
        subjectIcon: "🧪",
        isCustom: false,
        path: [
            { x: 30, y: 150 },
            { x: 260, y: 150 },
            { x: 260, y: 380 },
            { x: 520, y: 380 },
            { x: 520, y: 180 },
            { x: 760, y: 180 },
            { x: 760, y: 440 },
            { x: 970, y: 440 }
        ],
        slots: [
            { id: "sc-1", x: 140, y: 80 },
            { id: "sc-2", x: 140, y: 230 },
            { id: "sc-3", x: 380, y: 300 },
            { id: "sc-4", x: 380, y: 460 },
            { id: "sc-5", x: 640, y: 110 },
            { id: "sc-6", x: 640, y: 260 },
            { id: "sc-7", x: 880, y: 360 },
            { id: "sc-8", x: 880, y: 510 }
        ],
        briefing: [
            {
                id: "bch-plasma",
                turretType: "plasma",
                turretName: "Электронная пушка (Быстрая)",
                title: "1. Периодический закон и строение атома",
                content: "Порядковый номер химического элемента в таблице Менделеева равен числу протонов в ядре и числу электронов на оболочках. Номер периода определяет число электронных слоев, а номер группы (главной подгруппы) — число валентных электронов.",
                formula: "Z (порядковый номер) = N(протонов) = N(электронов)"
            },
            {
                id: "bch-cryo",
                turretType: "cryo",
                turretName: "Крио-Индикатор (Замедляющая)",
                title: "2. Кислоты, основания и индикаторы",
                content: "Кислоты содержат катионы H+ и кислотный остаток. Основания содержат гидроксид-ионы OH-. Индикатор лакмус в кислой среде становится красным, в щелочной — синим. Фенолфталеин в щелочи окрашивается в малиновый цвет.",
                formula: "pH < 7 (кислота, лакмус красный); pH > 7 (щелочь, фенолфталеин малиновый)"
            },
            {
                id: "bch-artillery",
                turretType: "artillery",
                turretName: "Катализатор Реакций (AoE-Мортира)",
                title: "3. Валентность и состав веществ",
                content: "Валентность — способность атома образовывать химические связи. Водород всегда одновалентен (I), кислород почти всегда двухвалентен (II). В формуле бинарного соединения произведение валентности на число атомов одного элемента равно произведению для другого.",
                formula: "Вода: H2O (H: I * 2 = O: II * 1). Углекислый газ: CO2 (C: IV * 1 = O: II * 2)"
            },
            {
                id: "bch-super",
                turretType: "super",
                turretName: "Протокол «Супер-удар: Нейтрализация»",
                title: "4. Реакция нейтрализации и сохранение массы",
                content: "Взаимодействие кислоты с основанием (щелочью) называется реакцией нейтрализации — образуется соль и вода. Закон сохранения массы гласит: общая масса веществ, вступивших в реакцию, равна массе образовавшихся веществ.",
                formula: "HCl + NaOH → NaCl + H2O (Кислота + Основание = Соль + Вода)"
            }
        ],
        waves: [
            {
                waveNumber: 1,
                name: "Разминка: Простые оксиды и газы",
                spawnInterval: 1400,
                enemies: [
                    { type: "scout", count: 8, hp: 60, speed: 1.45, rewardScore: 55, color: "#a3e635", name: "Летучий радикал" }
                ]
            },
            {
                waveNumber: 2,
                name: "Штурм: Кислотные дожди и соли",
                spawnInterval: 1200,
                enemies: [
                    { type: "scout", count: 7, hp: 75, speed: 1.5, rewardScore: 65, color: "#a3e635", name: "Агрессивный катион" },
                    { type: "trooper", count: 8, hp: 135, speed: 1.05, rewardScore: 105, color: "#38bdf8", name: "Серная кислота" }
                ]
            },
            {
                waveNumber: 3,
                name: "Финальная Реакция: Химический Коллапс",
                spawnInterval: 1100,
                enemies: [
                    { type: "trooper", count: 9, hp: 160, speed: 1.1, rewardScore: 120, color: "#38bdf8", name: "Концентрированная щелочь" },
                    { type: "tank", count: 4, hp: 310, speed: 0.72, rewardScore: 190, color: "#f43f5e", name: "Тяжелый Осадок" },
                    { type: "boss", count: 1, hp: 1350, speed: 0.5, rewardScore: 750, color: "#a855f7", isBoss: true, name: "Босс: Ядовитый Мутаген" }
                ]
            }
        ],
        questions: [
            {
                id: "qch-1",
                difficulty: "easy",
                cardId: "bch-plasma",
                turretType: "plasma",
                question: "Чему равно число электронов в нейтральном атоме?",
                options: ["Числу протонов (порядковому номеру)", "Числу нейтронов", "Номеру группы, умноженному на 2", "Атомной массе"],
                correctIndex: 0,
                explanation: "В нейтральном атоме число отрицательных электронов строго равно числу положительных протонов."
            },
            {
                id: "qch-2",
                difficulty: "easy",
                cardId: "bch-plasma",
                turretType: "plasma",
                question: "Какой химический знак обозначает кислород в периодической таблице?",
                options: ["O", "Ox", "K", "Os"],
                correctIndex: 0,
                explanation: "Кислород обозначается латинской буквой O (Oxygenium)."
            },
            {
                id: "qch-3",
                difficulty: "easy",
                cardId: "bch-plasma",
                turretType: "plasma",
                question: "Что показывает номер периода химического элемента?",
                options: ["Количество электронных слоев (уровней)", "Количество нейтронов", "Валентность по водороду", "Заряд ядра"],
                correctIndex: 0,
                explanation: "Номер периода соответствует общему числу энергетических (электронных) уровней атома."
            },
            {
                id: "qch-4",
                difficulty: "easy",
                cardId: "bch-plasma",
                turretType: "plasma",
                question: "Какая химическая формула у воды?",
                options: ["H2O", "HO2", "H2O2", "OH"],
                correctIndex: 0,
                explanation: "Формула чистой воды — два атома водорода и один атом кислорода: H2O."
            },
            {
                id: "qch-5",
                difficulty: "medium",
                cardId: "bch-cryo",
                turretType: "cryo",
                question: "В какой цвет окрашивается лакмус в кислой среде (например, в растворе HCl)?",
                options: ["Красный", "Синий", "Желтый", "Малиновый"],
                correctIndex: 0,
                explanation: "Лакмус в кислой среде приобретает ярко-красную окраску."
            },
            {
                id: "qch-6",
                difficulty: "medium",
                cardId: "bch-cryo",
                turretType: "cryo",
                question: "Какой цвет приобретает индикатор фенолфталеин в растворе щелочи (NaOH)?",
                options: ["Малиновый", "Бесцветный", "Синий", "Зеленый"],
                correctIndex: 0,
                explanation: "Фенолфталеин в щелочной среде становится характерного малинового цвета."
            },
            {
                id: "qch-7",
                difficulty: "medium",
                cardId: "bch-cryo",
                turretType: "cryo",
                question: "Какое значение водородного показателя (pH) соответствует нейтральной среде при 25°C?",
                options: ["pH = 7", "pH = 0", "pH = 14", "pH = 1"],
                correctIndex: 0,
                explanation: "pH = 7 — строго нейтральная среда (чистая дистиллированная вода)."
            },
            {
                id: "qch-8",
                difficulty: "medium",
                cardId: "bch-cryo",
                turretType: "cryo",
                question: "Какая кислота содержится в желудочном соке человека?",
                options: ["Соляная кислота (HCl)", "Серная кислота (H2SO4)", "Азотная кислота (HNO3)", "Уксусная кислота"],
                correctIndex: 0,
                explanation: "В желудочном соке для пищеварения содержится соляная кислота HCl."
            },
            {
                id: "qch-9",
                difficulty: "hard",
                cardId: "bch-artillery",
                turretType: "artillery",
                question: "Какова валентность углерода в молекуле углекислого газа CO2?",
                options: ["IV (четыре)", "II (два)", "I (один)", "VI (шесть)"],
                correctIndex: 0,
                explanation: "Кислород двухвалентен (II * 2 = 4), следовательно, валентность углерода равна IV."
            },
            {
                id: "qch-10",
                difficulty: "hard",
                cardId: "bch-artillery",
                turretType: "artillery",
                question: "Какова формула поваренной соли (хлорида натрия)?",
                options: ["NaCl", "Na2Cl", "NaCl2", "NaOH"],
                correctIndex: 0,
                explanation: "Натрий одновалентен и хлор в хлоридах одновалентен — формула соли NaCl."
            },
            {
                id: "qch-11",
                difficulty: "hard",
                cardId: "bch-super",
                turretType: "super",
                question: "Какие продукты образуются в реакции нейтрализации: HCl + NaOH → ...?",
                options: ["NaCl + H2O (хлорид натрия и вода)", "NaH + Cl2", "NaClO + H2", "Na2O + HCl"],
                correctIndex: 0,
                explanation: "Кислота + Основание = Соль (NaCl) + Вода (H2O)."
            },
            {
                id: "qch-12",
                difficulty: "hard",
                cardId: "bch-super",
                turretType: "super",
                question: "Кто из ученых сформулировал закон сохранения массы веществ в химических реакциях?",
                options: ["М. В. Ломоносов и А. Лавуазье", "Д. И. Менделеев", "Дж. Дальтон", "Нильс Бор"],
                correctIndex: 0,
                explanation: "Закон сохранения массы открыл М. В. Ломоносов (1748 г.) и независимо подтвердил А. Лавуазье (1789 г.)."
            }
        ]
    },
    // ==========================================
    // 8. ИНФОРМАТИКА: БИТЫ, АЛГОРИТМЫ И PYTHON
    // ==========================================
    {
        id: "school-cs",
        title: "8. Информатика: Биты, Алгоритмы и Python",
        description: "Остановите заражение школьной сети багами и вирусами! Примените двоичный код, логические вентили, циклы и алгоритмы.",
        subjectIcon: "💻",
        isCustom: false,
        path: [
            { x: 30, y: 150 },
            { x: 260, y: 150 },
            { x: 260, y: 380 },
            { x: 520, y: 380 },
            { x: 520, y: 180 },
            { x: 760, y: 180 },
            { x: 760, y: 440 },
            { x: 970, y: 440 }
        ],
        slots: [
            { id: "scs-1", x: 140, y: 80 },
            { id: "scs-2", x: 140, y: 230 },
            { id: "scs-3", x: 380, y: 300 },
            { id: "scs-4", x: 380, y: 460 },
            { id: "scs-5", x: 640, y: 110 },
            { id: "scs-6", x: 640, y: 260 },
            { id: "scs-7", x: 880, y: 360 },
            { id: "scs-8", x: 880, y: 510 }
        ],
        briefing: [
            {
                id: "bcs-plasma",
                turretType: "plasma",
                turretName: "Двоичный Бластер (Быстрая)",
                title: "1. Единицы измерения информации и двоичный код",
                content: "Наименьшая единица измерения информации — 1 бит (0 или 1). 1 Байт = 8 бит. 1 Килобайт (Кбайт) = 1024 байта, 1 Мегабайт (Мбайт) = 1024 Кбайта. Алфавит мощностью N символов кодируется i битами по формуле Хартли: N = 2^i.",
                formula: "1 Байт = 8 бит; 1 Кбайт = 1024 Байта; N = 2^i"
            },
            {
                id: "bcs-cryo",
                turretType: "cryo",
                turretName: "Крио-Цикл (Замедляющая)",
                title: "2. Алгоритмические конструкции и циклы",
                content: "Любой алгоритм строится из трех базовых конструкций: следование (пошаговое выполнение), ветвление (if/else) и цикл (повторение: for, while). Цикл с предусловием while продолжается до тех пор, пока условие истинно.",
                formula: "while condition: do_work() # Замедляет и останавливает врагов"
            },
            {
                id: "bcs-artillery",
                turretType: "artillery",
                turretName: "Компилятор Данных (AoE-Мортира)",
                title: "3. Логические операции (Алгебра логики)",
                content: "Конъюнкция (И, AND, ∧) истинна, только если ОБА высказывания истинны. Дизъюнкция (ИЛИ, OR, ∨) истинна, если хотя бы ОДНО высказывание истинно. Инверсия (НЕ, NOT, ¬) меняет 1 на 0, а 0 на 1.",
                formula: "1 AND 1 = 1; 1 OR 0 = 1; NOT 1 = 0; NOT 0 = 1"
            },
            {
                id: "bcs-super",
                turretType: "super",
                turretName: "Протокол «Супер-удар: Debug Boss»",
                title: "4. Язык Python: Остаток от деления и списки",
                content: "В языке Python оператор % вычисляет остаток от деления (например, 14 % 5 = 4), а // выполняет целочисленное деление (14 // 5 = 2). Индексация в списках начинается с 0. Функция len(list) возвращает длину списка.",
                formula: "a // b (частное), a % b (остаток); n % 2 == 0 (проверка на четность)"
            }
        ],
        waves: [
            {
                waveNumber: 1,
                name: "Разминка: Синтаксические баги",
                spawnInterval: 1400,
                enemies: [
                    { type: "scout", count: 8, hp: 60, speed: 1.45, rewardScore: 50, color: "#38bdf8", name: "NullPointer" }
                ]
            },
            {
                waveNumber: 2,
                name: "Штурм: Бесконечные циклы",
                spawnInterval: 1200,
                enemies: [
                    { type: "scout", count: 7, hp: 75, speed: 1.5, rewardScore: 65, color: "#38bdf8", name: "Stack Overflow" },
                    { type: "trooper", count: 8, hp: 135, speed: 1.05, rewardScore: 105, color: "#fb923c", name: "Memory Leak" }
                ]
            },
            {
                waveNumber: 3,
                name: "Финальный Экзамен: Вирус-Троян",
                spawnInterval: 1100,
                enemies: [
                    { type: "trooper", count: 8, hp: 160, speed: 1.1, rewardScore: 115, color: "#fb923c", name: "DDoS Worm" },
                    { type: "tank", count: 4, hp: 320, speed: 0.72, rewardScore: 190, color: "#f43f5e", name: "Kernel Panic" },
                    { type: "boss", count: 1, hp: 1400, speed: 0.5, rewardScore: 800, color: "#a855f7", isBoss: true, name: "Босс: Главный Руткит" }
                ]
            }
        ],
        questions: [
            {
                id: "qcs-1",
                difficulty: "easy",
                cardId: "bcs-plasma",
                turretType: "plasma",
                question: "Сколько бит содержится в 1 байте?",
                options: ["8", "10", "1024", "16"],
                correctIndex: 0,
                explanation: "1 байт по определению состоит из 8 бит."
            },
            {
                id: "qcs-2",
                difficulty: "easy",
                cardId: "bcs-plasma",
                turretType: "plasma",
                question: "Сколько байтов в 1 Килобайте (Кбайт)?",
                options: ["1024", "1000", "800", "2048"],
                correctIndex: 0,
                explanation: "В информатике 1 Килобайт = 2^10 = 1024 байта."
            },
            {
                id: "qcs-3",
                difficulty: "easy",
                cardId: "bcs-plasma",
                turretType: "plasma",
                question: "Какие цифры используются в двоичной системе счисления?",
                options: ["0 и 1", "0, 1 и 2", "От 0 до 9", "1 и 2"],
                correctIndex: 0,
                explanation: "Двоичная система счисления имеет основание 2 и использует только две цифры: 0 и 1."
            },
            {
                id: "qcs-4",
                difficulty: "easy",
                cardId: "bcs-plasma",
                turretType: "plasma",
                question: "Чему равно двоичное число 101 в десятичной системе счисления?",
                options: ["5", "3", "7", "6"],
                correctIndex: 0,
                explanation: "1 * 2^2 + 0 * 2^1 + 1 * 2^0 = 4 + 0 + 1 = 5."
            },
            {
                id: "qcs-5",
                difficulty: "medium",
                cardId: "bcs-cryo",
                turretType: "cryo",
                question: "Какая алгоритмическая конструкция используется для многократного повторения действий?",
                options: ["Цикл (повторение)", "Ветвление", "Линейное следование", "Присваивание"],
                correctIndex: 0,
                explanation: "Цикл позволяет повторять блок команд заданное число раз или пока истинно условие."
            },
            {
                id: "qcs-6",
                difficulty: "medium",
                cardId: "bcs-cryo",
                turretType: "cryo",
                question: "Что делает оператор break внутри цикла?",
                options: ["Досрочно прерывает выполнение цикла", "Перезапускает программу", "Пропускает одну итерацию", "Вызывает ошибку"],
                correctIndex: 0,
                explanation: "Оператор break осуществляет немедленный выход из текущего цикла."
            },
            {
                id: "qcs-7",
                difficulty: "medium",
                cardId: "bcs-artillery",
                turretType: "artillery",
                question: "Чему равно значение логического выражения: (1 OR 0) AND (NOT 0)?",
                options: ["1 (Истина)", "0 (Ложь)", "Не определено", "-1"],
                correctIndex: 0,
                explanation: "(1 OR 0) = 1, NOT 0 = 1. Итого: 1 AND 1 = 1 (True)."
            },
            {
                id: "qcs-8",
                difficulty: "medium",
                cardId: "bcs-artillery",
                turretType: "artillery",
                question: "Чему равно выражение (1 AND 0)?",
                options: ["0 (Ложь)", "1 (Истина)", "2", "True"],
                correctIndex: 0,
                explanation: "Логическое И (конъюнкция) истинно только когда оба операнда истинны. 1 AND 0 = 0."
            },
            {
                id: "qcs-9",
                difficulty: "hard",
                cardId: "bcs-super",
                turretType: "super",
                question: "В Python: чему равен результат выражения 17 % 5?",
                options: ["2", "3", "3.4", "1"],
                correctIndex: 0,
                explanation: "Оператор % возвращает остаток от деления: 17 = 5 * 3 + 2, остаток равен 2."
            },
            {
                id: "qcs-10",
                difficulty: "hard",
                cardId: "bcs-super",
                turretType: "super",
                question: "В Python: чему равен результат выражения 19 // 4?",
                options: ["4", "3", "4.75", "16"],
                correctIndex: 0,
                explanation: "Оператор // выполняет целочисленное деление без остатка: 19 // 4 = 4."
            },
            {
                id: "qcs-11",
                difficulty: "hard",
                cardId: "bcs-super",
                turretType: "super",
                question: "В Python дан список lst = [10, 20, 30, 40]. Чему равен элемент lst[1]?",
                options: ["20", "10", "30", "40"],
                correctIndex: 0,
                explanation: "В Python индексация начинается с 0, поэтому lst[0] = 10, а lst[1] = 20."
            },
            {
                id: "qcs-12",
                difficulty: "hard",
                cardId: "bcs-super",
                turretType: "super",
                question: "Какое условие в Python проверяет, что число n является четным?",
                options: ["n % 2 == 0", "n // 2 == 0", "n / 2 == 0", "n % 2 != 0"],
                correctIndex: 0,
                explanation: "Если остаток от деления на 2 равен нулю (n % 2 == 0), число n является четным."
            }
        ]
    }
];

function getLevelsList() {
    let customLevels = [];
    try {
        const stored = localStorage.getItem('qtd_teacher_custom_levels');
        if (stored) {
            customLevels = JSON.parse(stored);
        }
    } catch (e) {
        console.warn('Error reading custom levels:', e);
    }
    return [...DEFAULT_SCHOOL_LEVELS, ...customLevels];
}

let GAME_LEVELS = getLevelsList();

function reloadGameLevels() {
    GAME_LEVELS = getLevelsList();
    return GAME_LEVELS;
}

function getLevelConfig(idOrIndex) {
    GAME_LEVELS = getLevelsList();
    if (typeof idOrIndex === "number") {
        return GAME_LEVELS[idOrIndex] || GAME_LEVELS[0];
    }
    return GAME_LEVELS.find(l => l.id === idOrIndex) || GAME_LEVELS[0];
}

function saveTeacherLevel(newLevel) {
    try {
        const stored = localStorage.getItem('qtd_teacher_custom_levels');
        let list = stored ? JSON.parse(stored) : [];
        list.push(newLevel);
        localStorage.setItem('qtd_teacher_custom_levels', JSON.stringify(list));
        reloadGameLevels();
        return true;
    } catch (e) {
        console.error('Save teacher level error:', e);
        return false;
    }
}
