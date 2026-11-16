/**
 * School Curriculum Level Database & Teacher Custom Levels Storage
 * Subjects: Mathematics, Physics, Russian Language + User-generated custom levels.
 */

// Default School Levels
const DEFAULT_SCHOOL_LEVELS = [
    // ==========================================
    // 1. МАТЕМАТИКА И АЛГЕБРА
    // ==========================================
    {
        id: "school-math",
        title: "1. Математика: Дроби, Уравнения и Теоремы",
        description: "Отразите натиск ошибок в вычислениях! Примените правила работы с дробями, процентами, уравнениями и геометрией.",
        mapTheme: "arcade-yellow",
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
                explanation: "При сложении дробей с одинаковыми знаменателями складываются только числители: 1 + 2 = 3, знаменатель остается 4."
            },
            {
                id: "qm-2",
                difficulty: "easy",
                cardId: "bm-plasma",
                turretType: "plasma",
                question: "Чему равно произведение: 3/5 * 5/3?",
                options: ["1", "15/15 = 2", "9/25", "0"],
                correctIndex: 0,
                explanation: "Взаимно обратные дроби при перемножении сокращаются и всегда дают единицу: (3*5)/(5*3) = 15/15 = 1."
            },
            {
                id: "qm-3",
                difficulty: "easy",
                cardId: "bm-plasma",
                turretType: "plasma",
                question: "Сколько процентов составляет число 25 от числа 100?",
                options: ["25%", "50%", "4%", "12.5%"],
                correctIndex: 0,
                explanation: "25 от 100 — это ровно четверть (25/100), то есть 25%."
            },
            {
                id: "qm-4",
                difficulty: "easy",
                cardId: "bm-plasma",
                turretType: "plasma",
                question: "Найдите корень простого уравнения: 2x + 6 = 16.",
                options: ["x = 5", "x = 8", "x = 10", "x = 4"],
                correctIndex: 0,
                explanation: "2x = 16 - 6 => 2x = 10 => x = 10 / 2 => x = 5."
            },
            {
                id: "qm-5",
                difficulty: "medium",
                cardId: "bm-cryo",
                turretType: "cryo",
                question: "Товар стоил 2000 рублей. Цену снизили на 15%. Какова новая цена?",
                options: ["1700 рублей", "1850 рублей", "1600 рублей", "1750 рублей"],
                correctIndex: 0,
                explanation: "15% от 2000 = 2000 * 0.15 = 300 руб. Новая цена: 2000 - 300 = 1700 руб."
            },
            {
                id: "qm-6",
                difficulty: "medium",
                cardId: "bm-cryo",
                turretType: "cryo",
                question: "Решите пропорцию: x / 6 = 5 / 2. Чему равен x?",
                options: ["15", "12", "10", "30"],
                correctIndex: 0,
                explanation: "По правилу пропорции: 2 * x = 6 * 5 => 2x = 30 => x = 15."
            },
            {
                id: "qm-7",
                difficulty: "medium",
                cardId: "bm-artillery",
                turretType: "artillery",
                question: "Катеты прямоугольного треугольника равны 3 см и 4 см. Найдите гипотенузу.",
                options: ["5 см", "7 см", "6 см", "25 см"],
                correctIndex: 0,
                explanation: "По теореме Пифагора: c² = 3² + 4² = 9 + 16 = 25 => c = √25 = 5 см (египетский треугольник)."
            },
            {
                id: "qm-8",
                difficulty: "medium",
                cardId: "bm-artillery",
                turretType: "artillery",
                question: "Чему равна площадь прямоугольника со сторонами 7 см и 8 см?",
                options: ["56 см²", "30 см²", "15 см²", "64 см²"],
                correctIndex: 0,
                explanation: "Площадь прямоугольника равна произведению длины на ширину: S = a * b = 7 * 8 = 56 см²."
            },
            {
                id: "qm-9",
                difficulty: "hard",
                cardId: "bm-super",
                turretType: "super",
                question: "Чему равен дискриминант квадратного уравнения: x² - 6x + 8 = 0?",
                options: ["4 (два корня: 2 и 4)", "0 (один корень)", "16", "-4 (нет корней)"],
                correctIndex: 0,
                explanation: "D = b² - 4ac = (-6)² - 4 * 1 * 8 = 36 - 32 = 4. Корни: (6 ± 2)/2 = 4 и 2."
            },
            {
                id: "qm-10",
                difficulty: "hard",
                cardId: "bm-super",
                turretType: "super",
                question: "Раскройте формулу разности квадратов: (a - b)(a + b) = ?",
                options: ["a² - b²", "a² + b²", "a² - 2ab + b²", "(a - b)²"],
                correctIndex: 0,
                explanation: "Формула сокращенного умножения: произведение разности двух выражений на их сумму равно разности их квадратов (a² - b²)."
            },
            {
                id: "qm-11",
                difficulty: "hard",
                cardId: "bm-artillery",
                turretType: "artillery",
                question: "Гипотенуза треугольника равна 10 см, один катет равен 6 см. Найдите второй катет.",
                options: ["8 см", "4 см", "64 см", "7 см"],
                correctIndex: 0,
                explanation: "b² = c² - a² = 10² - 6² = 100 - 36 = 64 => b = √64 = 8 см."
            },
            {
                id: "qm-12",
                difficulty: "hard",
                cardId: "bm-super",
                turretType: "super",
                question: "Чему равно значение выражения: 2⁵ * 2³ / 2⁶?",
                options: ["4 (2²)", "8", "2", "16"],
                correctIndex: 0,
                explanation: "При умножении степеней показатели складываются (5 + 3 = 8), при делении вычитаются (8 - 6 = 2). 2² = 4."
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
        mapTheme: "arcade-cyan",
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
                content: "Второй закон Ньютона: сила равна произведению массы тела на его ускорение (F = m * a). Сила тяжести у поверхности Земли вычисляется как F = m * g (где g ≈ 9.8 м/с²).",
                formula: "F = m * a; Fтяж = m * g"
            },
            {
                id: "bp-artillery",
                turretType: "artillery",
                turretName: "Закон Ома (AoE-Мортира)",
                title: "3. Электричество: Закон Ома",
                content: "Сила тока I на участке цепи прямо пропорциональна напряжению U и обратно пропорциональна электрическому сопротивлению R. Единицы: Ампер, Вольт, Ом.",
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
                explanation: "S = v * t = 60 км/ч * 2 ч = 120 км."
            },
            {
                id: "qp-2",
                difficulty: "easy",
                cardId: "bp-plasma",
                turretType: "plasma",
                question: "В каких единицах в Международной системе СИ измеряется сила?",
                options: ["В Ньютонах (Н)", "В Джоулях (Дж)", "В Паскалях (Па)", "В Ваттах (Вт)"],
                correctIndex: 0,
                explanation: "Сила измеряется в Ньютонах (Н). Джоули — энергия/работа, Паскали — давление, Ватты — мощность."
            },
            {
                id: "qp-3",
                difficulty: "easy",
                cardId: "bp-cryo",
                turretType: "cryo",
                question: "Чему примерно равно ускорение свободного падения (g) на Земле?",
                options: ["9.8 м/с²", "100 м/с²", "3.14 м/с²", "1.6 м/с²"],
                correctIndex: 0,
                explanation: "Стандартное ускорение свободного падения у поверхности Земли составляет g ≈ 9.8 м/с² (в школьных задачах часто округляют до 10)."
            },
            {
                id: "qp-4",
                difficulty: "easy",
                cardId: "bp-artillery",
                turretType: "artillery",
                question: "Напряжение в цепи 12 В, сопротивление 4 Ом. Какова сила тока (Закон Ома)?",
                options: ["3 А", "48 А", "0.33 А", "8 А"],
                correctIndex: 0,
                explanation: "По закону Ома: I = U / R = 12 / 4 = 3 Ампера."
            },
            {
                id: "qp-5",
                difficulty: "medium",
                cardId: "bp-cryo",
                turretType: "cryo",
                question: "Какая сила действует на тело массой 5 кг, если оно движется с ускорением 3 м/с²?",
                options: ["15 Н", "8 Н", "1.67 Н", "45 Н"],
                correctIndex: 0,
                explanation: "Второй закон Ньютона: F = m * a = 5 кг * 3 м/с² = 15 Ньютонов."
            },
            {
                id: "qp-6",
                difficulty: "medium",
                cardId: "bp-artillery",
                turretType: "artillery",
                question: "Какое сопротивление имеет лампочка, если при напряжении 220 В через нее течет ток 2 А?",
                options: ["110 Ом", "440 Ом", "220 Ом", "55 Ом"],
                correctIndex: 0,
                explanation: "R = U / I = 220 В / 2 А = 110 Ом."
            },
            {
                id: "qp-7",
                difficulty: "medium",
                cardId: "bp-plasma",
                turretType: "plasma",
                question: "При какой температуре по шкале Цельсия замерзает чистая вода при нормальном давлении?",
                options: ["0 °C", "-10 °C", "32 °C", "100 °C"],
                correctIndex: 0,
                explanation: "Вода переходит из жидкого состояния в лед при температуре 0 градусов Цельсия."
            },
            {
                id: "qp-8",
                difficulty: "medium",
                cardId: "bp-cryo",
                turretType: "cryo",
                question: "В чем суть Первого закона Ньютона (закона инерции)?",
                options: [
                    "Тело сохраняет состояние покоя или равномерного прямолинейного движения, если на него не действуют силы",
                    "Сила действия равна силе противодействия",
                    "Тела притягиваются друг к другу пропорционально массам",
                    "Энергия не возникает из ничего и не исчезает"
                ],
                correctIndex: 0,
                explanation: "Первый закон Ньютона утверждает существование инерциальных систем отсчета, где тело движется равномерно и прямолинейно при отсутствии внешних сил."
            },
            {
                id: "qp-9",
                difficulty: "hard",
                cardId: "bp-super",
                turretType: "super",
                question: "Тело массой 2 кг движется со скоростью 4 м/с. Чему равна его кинетическая энергия?",
                options: ["16 Дж", "8 Дж", "32 Дж", "4 Дж"],
                correctIndex: 0,
                explanation: "Eк = (m * v²) / 2 = (2 * 4²) / 2 = (2 * 16) / 2 = 16 Джоулей."
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
                explanation: "Тела действуют друг на друга с силами, равными по модулю и противоположными по направлению: F₁ = -F₂."
            },
            {
                id: "qp-11",
                difficulty: "hard",
                cardId: "bp-artillery",
                turretType: "artillery",
                question: "Как изменится сопротивление проводника, если его длину увеличить в 2 раза?",
                options: ["Увеличится в 2 раза", "Уменьшится в 2 раза", "Увеличится в 4 раза", "Не изменится"],
                correctIndex: 0,
                explanation: "R = ρ * l / S. Сопротивление прямо пропорционально длине проводника l, поэтому оно вырастет ровно в 2 раза."
            },
            {
                id: "qp-12",
                difficulty: "hard",
                cardId: "bp-super",
                turretType: "super",
                question: "Чему равна потенциальная энергия груза массой 3 кг, поднятого на высоту 4 м (g = 10 м/с²)?",
                options: ["120 Дж", "70 Дж", "12 Дж", "60 Дж"],
                correctIndex: 0,
                explanation: "Eп = m * g * h = 3 кг * 10 м/с² * 4 м = 120 Джоулей."
            }
        ]
    },

    // ==========================================
    // 3. РУССКИЙ ЯЗЫК И ГРАМОТНОСТЬ
    // ==========================================
    {
        id: "school-russian",
        title: "3. Русский язык: Орфография и Пунктуация",
        description: "Защитите грамотность от орфографических вирусов! Проверьте правописание корней, приставок, суффиксов и знаки препинания.",
        mapTheme: "arcade-pink",
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
                content: "Чтобы проверить безударную гласную в корне, нужно изменить форму слова или подобрать однокоренное слово так, чтобы эта гласная оказалась под ударением (водá — вóды). Корни с чередованием (бер/бир, лаг/лож) подчиняются особым правилам.",
                formula: "водá ➔ вóдный; положúть ➔ полагáть (суффикс -а-)"
            },
            {
                id: "br-cryo",
                turretType: "cryo",
                turretName: "Приставка-Стоп (Крио)",
                title: "2. Правописание приставок ПРЕ- и ПРИ-",
                content: "Приставка ПРИ- пишется в значениях: приближение, присоединение, неполнота действия, пространственная близость. Приставка ПРЕ- пишется в значении 'очень' (прекрасный) или сходна с приставкой ПЕРЕ- (преградить).",
                formula: "ПРИехать (приближение), ПРИоткрыть (чуть-чуть), ПРЕдобрый (= очень добрый)"
            },
            {
                id: "br-artillery",
                turretType: "artillery",
                turretName: "Мортира НЕ с частями речи",
                title: "3. Слитное и раздельное написание НЕ",
                content: "НЕ с глаголами и деепричастиями пишется раздельно (кроме слов, не употребляющихся без НЕ: ненавидеть). С существительными и прилагательными пишется слитно, если можно заменить синонимом без НЕ (неправда = ложь), и раздельно при противопоставлении с союзом 'а'.",
                formula: "НЕ знал (глагол); неправда (=ложь); не правда, а ложь"
            },
            {
                id: "br-super",
                turretType: "super",
                turretName: "Протокол «Супер-удар: Синтаксис»",
                title: "4. Пунктуация в сложном предложении",
                content: "Перед союзами 'что', 'чтобы', 'потому что', 'который' в сложноподчиненных предложениях всегда ставится запятая. В сложносочиненном предложении перед союзом 'и' ставится запятая, если у частей нет общего второстепенного члена.",
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
                explanation: "Горá — проверочное слово 'гóры' (под ударением слышится отчетливо 'О')."
            },
            {
                id: "qr-2",
                difficulty: "easy",
                cardId: "br-artillery",
                turretType: "artillery",
                question: "Как правильно пишется глагол: (не)был на уроке?",
                options: ["Не был (раздельно)", "Небыл (слитно)", "Ни был", "Не-был (через дефис)"],
                correctIndex: 0,
                explanation: "НЕ с глаголами пишется раздельно: не был, не знал, не читал."
            },
            {
                id: "qr-3",
                difficulty: "easy",
                cardId: "br-plasma",
                turretType: "plasma",
                question: "Какое из этих слов является именем существительным?",
                options: ["Книга", "Быстрый", "Бежать", "Весело"],
                correctIndex: 0,
                explanation: "'Книга' отвечает на вопрос 'что?' и обозначает предмет, являясь именем существительным."
            },
            {
                id: "qr-4",
                difficulty: "easy",
                cardId: "br-cryo",
                turretType: "cryo",
                question: "В каком слове пишется приставка ПРИ-?",
                options: [
                    "Пр...ехать (значение приближения)",
                    "Пр...мудрый (значение 'очень')",
                    "Пр...красный (значение 'очень')",
                    "Пр...градить (сходно с пере-)"
                ],
                correctIndex: 0,
                explanation: "Приехать пишется с приставкой ПРИ- в значении приближения к цели."
            },
            {
                id: "qr-5",
                difficulty: "medium",
                cardId: "br-cryo",
                turretType: "cryo",
                question: "В каком слове пишется приставка ПРЕ-?",
                options: [
                    "Пр...милый (в значении 'очень милый')",
                    "Пр...шить пуговицу",
                    "Пр...брежный район",
                    "Пр...открыть форточку"
                ],
                correctIndex: 0,
                explanation: "Премилый означает 'очень милый', поэтому пишется приставка ПРЕ-."
            },
            {
                id: "qr-6",
                difficulty: "medium",
                cardId: "br-artillery",
                turretType: "artillery",
                question: "В каком варианте НЕ пишется слитно?",
                options: [
                    "Неправда (синоним: ложь)",
                    "Не читал книгу",
                    "Не правда, а обман",
                    "Вовсе не красивый"
                ],
                correctIndex: 0,
                explanation: "'Неправда' пишется слитно, так как нет противопоставления с 'а' и слово можно заменить синонимом 'ложь'."
            },
            {
                id: "qr-7",
                difficulty: "medium",
                cardId: "br-super",
                turretType: "super",
                question: "Где нужно поставить запятую в предложении: 'Солнце село (1) и на небе зажглись первые звезды (2)'?",
                options: ["Только на месте (1)", "На месте (1) и (2)", "Запятые не нужны", "Только на месте (2)"],
                correctIndex: 0,
                explanation: "Это сложносочиненное предложение с двумя грамматическими основами ('Солнце село' и 'звезды зажглись'), перед союзом 'и' ставится запятая (1)."
            },
            {
                id: "qr-8",
                difficulty: "medium",
                cardId: "br-plasma",
                turretType: "plasma",
                question: "В каком слове пишется буква 'И' в корне с чередованием?",
                options: [
                    "Соб...рать (есть суффикс -А-)",
                    "Соб...ру",
                    "Зап...реть",
                    "Бл...стеть"
                ],
                correctIndex: 0,
                explanation: "В корнях бер/бир пишется буква 'И', если после корня стоит суффикс -А- (собирáть, но соберý)."
            },
            {
                id: "qr-9",
                difficulty: "hard",
                cardId: "br-super",
                turretType: "super",
                question: "Укажите верное написание слова: 'мыш...нок'. Какая буква пропущена?",
                options: ["О (мышóнок)", "Ё (мышёнок)", "Е (мышенок)", "А (мышанок)"],
                correctIndex: 0,
                explanation: "Под ударением в суффиксе существительных -онок- после шипящих пишется буква 'О': мышонок, волчонок, медвежонок."
            },
            {
                id: "qr-10",
                difficulty: "hard",
                cardId: "br-artillery",
                turretType: "artillery",
                question: "В каком предложении НЕ пишется раздельно?",
                options: [
                    "Никому (не)известный автор",
                    "Небрежный почерк",
                    "Невысокий забор",
                    "Несчастье объединило их"
                ],
                correctIndex: 0,
                explanation: "При наличии отрицательного местоимения с ни- ('никому не известный') частица НЕ с прилагательным пишется раздельно."
            },
            {
                id: "qr-11",
                difficulty: "hard",
                cardId: "br-super",
                turretType: "super",
                question: "Какое слово пишется с двумя буквами 'НН'?",
                options: ["Стекля...ый (исключение)", "Кожа...ый", "Песча...ый", "Ю...ый"],
                correctIndex: 0,
                explanation: "Стеклянный, оловянный, деревянный — три знаменитых слова-исключения, пишущихся с суффиксом -янн- с двумя буквами НН."
            },
            {
                id: "qr-12",
                difficulty: "hard",
                cardId: "br-super",
                turretType: "super",
                question: "Какая грамматическая основа в предложении: 'В саду громко пели лесные птицы'?",
                options: ["Птицы пели", "Пели лесные", "Пели в саду", "Птицы лесные"],
                correctIndex: 0,
                explanation: "Подлежащее: 'птицы' (кто?), сказуемое: 'пели' (что делали?). Грамматическая основа — 'птицы пели'."
            }
        ]
    }
];

// Load Levels: Default School Levels + Teacher's Custom Levels from localStorage
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

// Global active levels array
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

// Teacher storage helper
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
