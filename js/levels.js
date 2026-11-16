/**
 * Level Database for Quiz Tower Defense
 * Contains curriculum theory, question pools, path waypoints, slots, and enemy wave configurations.
 * Levels 1, 2, and 3.
 */
const GAME_LEVELS = [
    // ==========================================
    // LEVEL 1: WEB SECURITY (SQLi & XSS)
    // ==========================================
    {
        id: "level-1",
        title: "Уровень 1: Веб-безопасность (SQLi & XSS)",
        description: "Отразите атаку киберпреступников на сервер базы данных, изучив ключевые векторы атак веб-приложений: внедрение SQL-кода и межсайтовый скриптинг.",
        mapTheme: "cyber-blue",
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
            { id: "s1-1", x: 140, y: 80 },
            { id: "s1-2", x: 140, y: 230 },
            { id: "s1-3", x: 380, y: 300 },
            { id: "s1-4", x: 380, y: 460 },
            { id: "s1-5", x: 640, y: 110 },
            { id: "s1-6", x: 640, y: 260 },
            { id: "s1-7", x: 880, y: 360 },
            { id: "s1-8", x: 880, y: 510 }
        ],
        briefing: [
            {
                id: "b1-plasma",
                turretType: "plasma",
                turretName: "Плазменный Фаервол (Быстрая)",
                title: "1. SQL-инъекции (SQLi) & Подготовленные запросы",
                content: "SQLi возникает при конкатенации непроверенного ввода пользователя в тело SQL-запроса, что позволяет злоумышленнику обойти авторизацию или извлечь данные. Главный метод абсолютной защиты — использование параметризованных (подготовленных) запросов (Prepared Statements) и ORM, разделяющих код и данные.",
                formula: "SELECT * FROM users WHERE login = ? AND pass_hash = ?"
            },
            {
                id: "b1-cryo",
                turretType: "cryo",
                turretName: "Крио-Санитизатор (Замедляющая)",
                title: "2. Межсайтовый скриптинг (XSS) & Экранирование",
                content: "XSS позволяет внедрить вредоносный JavaScript в страницу жертвы. Различают Stored (хранимый в БД), Reflected (отраженный в параметрах URL) и DOM-based. Защита: строгое контекстное экранирование (HTML/JS/CSS entity encoding) и санитизация библиотеками (например, DOMPurify).",
                formula: "element.textContent = sanitizeInput(userInput);"
            },
            {
                id: "b1-artillery",
                turretType: "artillery",
                turretName: "Тяжелая WAF-Мортира (AoE-Урон)",
                title: "3. CSRF & SameSite Cookies",
                content: "CSRF (подделка межсайтовых запросов) заставляет браузер жертвы выполнять несанкционированные действия от её имени, используя сохраненные сессионные cookies. Защита строится на Anti-CSRF токенах (Double Submit Cookie) и атрибуте cookies 'SameSite=Strict' или 'SameSite=Lax'.",
                formula: "Set-Cookie: session=xyz123; SameSite=Strict; Secure; HttpOnly"
            },
            {
                id: "b1-super",
                turretType: "super",
                turretName: "Протокол «Супер-удар» (WAF-ZeroDay)",
                title: "4. CSP (Content Security Policy) & Защита от Боссов",
                content: "Заголовок ответа HTTP 'Content-Security-Policy' блокирует выполнение inline-скриптов и загрузку ресурсов с недоверенных доменов, нивелируя даже успешный XSS. WAF (Web Application Firewall) на периметре анализирует сигнатуры и аномалии трафика.",
                formula: "Content-Security-Policy: default-src 'self'; script-src 'self' cdn.domain.com"
            }
        ],
        waves: [
            {
                waveNumber: 1,
                name: "Разведка ботом: Скрипт-кидди",
                spawnInterval: 1400,
                enemies: [
                    { type: "scout", count: 8, hp: 55, speed: 1.45, rewardScore: 50, color: "#38bdf8", name: "Сканер портов" }
                ]
            },
            {
                waveNumber: 2,
                name: "Штурм: Внедрение SQL-эксплойтов",
                spawnInterval: 1200,
                enemies: [
                    { type: "scout", count: 6, hp: 65, speed: 1.5, rewardScore: 60, color: "#38bdf8", name: "XSS-Дрон" },
                    { type: "trooper", count: 8, hp: 120, speed: 1.05, rewardScore: 100, color: "#f59e0b", name: "SQL-Ботнет" }
                ]
            },
            {
                waveNumber: 3,
                name: "Финальная атака: Zero-Day Эксплойт",
                spawnInterval: 1100,
                enemies: [
                    { type: "trooper", count: 8, hp: 140, speed: 1.1, rewardScore: 110, color: "#f59e0b", name: "CSRF-Штурмовик" },
                    { type: "tank", count: 4, hp: 260, speed: 0.75, rewardScore: 180, color: "#ef4444", name: "Армада Троянов" },
                    { type: "boss", count: 1, hp: 1050, speed: 0.55, rewardScore: 600, color: "#a855f7", isBoss: true, name: "Босс: Zero-Day SQLi Червь" }
                ]
            }
        ],
        questions: [
            {
                id: "q1-1",
                difficulty: "easy",
                cardId: "b1-plasma",
                turretType: "plasma",
                question: "Какая конструкция SQL-запроса делает приложение уязвимым к классической SQL-инъекции?",
                options: [
                    "Конкатенация строк: \"SELECT * FROM users WHERE name = '\" + input + \"'\"",
                    "Использование плейсхолдеров: query('SELECT * FROM users WHERE name = ?', [input])",
                    "Применение ORM-метода: User.findByPk(userId)",
                    "Хеширование пароля перед запросом: bcrypt.hash(password)"
                ],
                correctIndex: 0,
                explanation: "Прямая склейка (конкатенация) непроверенного пользовательского ввода со строкой SQL позволяет злоумышленнику модифицировать логику запроса (например, передать `' OR 1=1 --`)."
            },
            {
                id: "q1-2",
                difficulty: "easy",
                cardId: "b1-plasma",
                turretType: "plasma",
                question: "Что произойдет, если в уязвимое поле ввода логина ввести `admin' --`?",
                options: [
                    "Сервер упадет с синтаксической ошибкой базы данных",
                    "База данных скомпилирует запрос заново и заблокирует пользователя",
                    "Часть запроса после `--` превратится в комментарий, пропуская проверку пароля",
                    "Символ `'` автоматически экранируется операционной системой"
                ],
                correctIndex: 2,
                explanation: "В SQL два дефиса `--` обозначают строчный комментарий. Всё, что следует за ним (включая проверку пароля `AND pass = ...`), отсекается."
            },
            {
                id: "q1-3",
                difficulty: "easy",
                cardId: "b1-plasma",
                turretType: "plasma",
                question: "Что является фундаментальным и самым надежным средством защиты от SQL-инъекций?",
                options: [
                    "Черный список стоп-слов (SELECT, UNION, DROP)",
                    "Параметризованные (подготовленные) запросы (Prepared Statements)",
                    "Шифрование базы данных алгоритмом AES-256",
                    "Отключение вывода ошибок базы данных в консоль"
                ],
                correctIndex: 1,
                explanation: "Prepared Statements отправляют шаблон SQL и пользовательские параметры раздельно. База данных обрабатывает параметры исключительно как литеральные данные, а не как исполняемый код."
            },
            {
                id: "q1-4",
                difficulty: "easy",
                cardId: "b1-plasma",
                turretType: "plasma",
                question: "Какой флаг cookie предотвращает чтение сессионного идентификатора через JavaScript (XSS)?",
                options: [
                    "SameSite",
                    "Secure",
                    "HttpOnly",
                    "Domain"
                ],
                correctIndex: 2,
                explanation: "Флаг HttpOnly запрещает скриптам браузера (document.cookie) обращаться к cookie, снижая риск их кражи при XSS."
            },
            {
                id: "q1-5",
                difficulty: "medium",
                cardId: "b1-cryo",
                turretType: "cryo",
                question: "Чем отличается хранимый (Stored) XSS от отраженного (Reflected)?",
                options: [
                    "Stored исполняется на сервере, а Reflected только в браузере",
                    "Stored сохраняется в базе данных жертвы и атакует всех посетителей страницы",
                    "Reflected работает без JavaScript через чистый CSS",
                    "Stored требует обязательного доступа по SSH к серверу"
                ],
                correctIndex: 1,
                explanation: "При Stored XSS вредоносный код сохраняется на сервере (например, в комментарии или профиле) и срабатывает у каждого пользователя, открывшего страницу."
            },
            {
                id: "q1-6",
                difficulty: "medium",
                cardId: "b1-cryo",
                turretType: "cryo",
                question: "Какое свойство JavaScript DOM наиболее безопасно для вставки текста пользователя во избежание XSS?",
                options: [
                    "element.innerHTML = userInput",
                    "element.outerHTML = userInput",
                    "element.textContent = userInput",
                    "document.write(userInput)"
                ],
                correctIndex: 2,
                explanation: "Свойство textContent интерпретирует переданную строку как обычный плоский текст и никогда не парсит HTML-теги и теги <script>."
            },
            {
                id: "q1-7",
                difficulty: "medium",
                cardId: "b1-cryo",
                turretType: "cryo",
                question: "Что такое DOM-based XSS?",
                options: [
                    "Атака, при которой вредоносный полезный payload исполняется исключительно в результате модификации DOM скриптом на клиенте",
                    "Внедрение скрипта через модификацию DNS-записей",
                    "Переполнение стека в парсере HTML веб-сервера",
                    "Подделка SSL-сертификата веб-приложения"
                ],
                correctIndex: 0,
                explanation: "При DOM XSS уязвимость возникает прямо на клиенте: JS-код читает данные из источника (source, например location.hash) и небезопасно передает их в приемник (sink, например eval или innerHTML)."
            },
            {
                id: "q1-8",
                difficulty: "medium",
                cardId: "b1-cryo",
                turretType: "cryo",
                question: "Какую опасность представляет вектор атаки: `<img src=x onerror=alert(1)>`?",
                options: [
                    "Отказ в обслуживании файлового хранилища картинок",
                    "Обход фильтров тега `<script>` для выполнения произвольного JS-кода при ошибке загрузки изображения",
                    "Попытка переполнения буфера в видеодрайвере",
                    "Автоматическая отправка паролей по FTP"
                ],
                correctIndex: 1,
                explanation: "Это классический XSS-вектор: несуществующий путь 'x' вызывает событие 'onerror', в обработчике которого запускается любой JS-код в обход простых фильтров тега <script>."
            },
            {
                id: "q1-9",
                difficulty: "hard",
                cardId: "b1-artillery",
                turretType: "artillery",
                question: "Какое значение атрибута SameSite в Cookie гарантирует, что cookie не будут отправлены даже при переходе по ссылке со стороннего сайта?",
                options: [
                    "SameSite=None",
                    "SameSite=Lax",
                    "SameSite=Strict",
                    "SameSite=Isolated"
                ],
                correctIndex: 2,
                explanation: "SameSite=Strict полностью запрещает передачу cookies при любых межсайтовых запросах, даже при обычном клике по ссылке со стороннего ресурса."
            },
            {
                id: "q1-10",
                difficulty: "hard",
                cardId: "b1-artillery",
                turretType: "artillery",
                question: "В чем фундаментальная разница между атаками XSS и CSRF?",
                options: [
                    "XSS использует уязвимости протокола HTTP, а CSRF — ошибки в ОС",
                    "При XSS злоумышленник выполняет JS в контексте страницы, а при CSRF — злоупотребляет доверием сервера к сессии пользователя без чтения данных",
                    "XSS возможен только на мобильных браузерах, а CSRF на десктопных",
                    "CSRF позволяет украсть HttpOnly cookies, а XSS нет"
                ],
                correctIndex: 1,
                explanation: "XSS эксплуатирует доверие пользователя к сайту (выполняя скрипты внутри приложения), а CSRF эксплуатирует доверие сайта к браузеру пользователя (выполняя слепой запрос с его куками)."
            },
            {
                id: "q1-11",
                difficulty: "hard",
                cardId: "b1-super",
                turretType: "super",
                question: "Какая директива CSP (Content Security Policy) блокирует запуск inline-скриптов и вызовы вида `eval()`?",
                options: [
                    "script-src 'self' (без 'unsafe-inline' и 'unsafe-eval')",
                    "style-src 'unsafe-inline'",
                    "frame-ancestors 'none'",
                    "default-src * data: blob:"
                ],
                correctIndex: 0,
                explanation: "Указание `script-src 'self'` без модификаторов 'unsafe-inline' и 'unsafe-eval' полностью запрещает инлайновые блоки <script> и динамическое вычисление кода."
            },
            {
                id: "q1-12",
                difficulty: "hard",
                cardId: "b1-super",
                turretType: "super",
                question: "Что представляет собой метод «Слепой» (Blind) SQL-инъекции на основе времени (Time-Based)?",
                options: [
                    "Перегрузка процессора сервера бесконечным циклом в JS",
                    "Определение истинности условий путем замера времени ответа сервера с помощью функций ожидания (напр. SLEEP(5))",
                    "Синхронизация системных часов NTP клиента и сервера",
                    "Шифрование данных базы с требованием выкупа"
                ],
                correctIndex: 1,
                explanation: "Если сервер не возвращает данных и ошибок, атакующий внедряет проверку: ЕСЛИ (условие верно) ТО SLEEP(5). Если ответ задержался на 5 сек — условие истинно."
            }
        ]
    },

    // ==========================================
    // LEVEL 2: COMPUTER NETWORKS (TCP/IP & DNS)
    // ==========================================
    {
        id: "level-2",
        title: "Уровень 2: Компьютерные сети (TCP/IP и DNS)",
        description: "Защитите магистральный сетевой шлюз от лавины вредоносных пакетов, применив фундаментальные знания о стеке TCP/IP, рукопожатии и системе DNS.",
        mapTheme: "network-green",
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
            { id: "s2-1", x: 100, y: 220 },
            { id: "s2-2", x: 300, y: 200 },
            { id: "s2-3", x: 340, y: 60 },
            { id: "s2-4", x: 380, y: 360 },
            { id: "s2-5", x: 600, y: 280 },
            { id: "s2-6", x: 620, y: 530 },
            { id: "s2-7", x: 860, y: 140 },
            { id: "s2-8", x: 860, y: 320 }
        ],
        briefing: [
            {
                id: "b2-plasma",
                turretType: "plasma",
                turretName: "TCP-Фильтр SYN (Быстрая)",
                title: "1. 3-Way Handshake & Протокол TCP",
                content: "TCP обеспечивает надежную передачу данных с контролем целостности, порядка и повторной отправкой потерянных пакетов. Установление соединения происходит через тройное рукопожатие: клиент шлет SYN, сервер отвечает SYN-ACK, клиент подтверждает ACK. SYN-flood атака истощает таблицу полуоткрытых соединений сервера.",
                formula: "SYN (Seq=x) ➔ SYN-ACK (Seq=y, Ack=x+1) ➔ ACK (Ack=y+1)"
            },
            {
                id: "b2-cryo",
                turretType: "cryo",
                turretName: "UDP Дроссель / Замедлитель (Замедляющая)",
                title: "2. UDP (User Datagram Protocol) & Трафик в реальном времени",
                content: "UDP — легковесный протокол без установления соединения (connectionless), не гарантирующий доставку и порядок пакетов. Применяется в VoIP, потоковом видео и онлайн-играх ради минимальной задержки. Уязвим к спуфингу IP-адреса источника и амплификационным DDoS-атакам.",
                formula: "Заголовок UDP: 8 байт (Порт источника, Порт назначения, Длина, Чексумма)"
            },
            {
                id: "b2-artillery",
                turretType: "artillery",
                turretName: "DNS-Резолвер Мортира (AoE-Урон)",
                title: "3. Архитектура DNS & Ресурсные записи",
                content: "DNS преобразует доменные имена в IP-адреса. Основные типы записей: A (IPv4-адрес), AAAA (IPv6), CNAME (канонический псевдоним), MX (почтовый сервер), TXT (проверки SPF/DKIM). Рекурсивный резолвер кэширует ответы на время, заданное параметром TTL (Time-To-Live).",
                formula: "example.com. 300 IN A 93.184.216.34"
            },
            {
                id: "b2-super",
                turretType: "super",
                turretName: "Протокол «Супер-удар» (BGP/Anycast Чистка)",
                title: "4. Anycast, BGP & Защита от DDoS-Босса",
                content: "BGP (Border Gateway Protocol) координирует маршрутизацию между глобальными Автономными Системами (AS). Технология BGP Anycast позволяет объявлять один и тот же IP-адрес из множества дата-центров по всему миру, распределяя терабитные DDoS-атаки на региональные узлы фильтрации.",
                formula: "AS-PATH: 13335 15169 ➔ BGP Anycast Scrubbing Center"
            }
        ],
        waves: [
            {
                waveNumber: 1,
                name: "Сетевой шторм: SYN-Flood атака",
                spawnInterval: 1300,
                enemies: [
                    { type: "scout", count: 9, hp: 65, speed: 1.5, rewardScore: 50, color: "#38bdf8", name: "SYN-Пакет" }
                ]
            },
            {
                waveNumber: 2,
                name: "Удар по резолверам: DNS Амплификация",
                spawnInterval: 1100,
                enemies: [
                    { type: "scout", count: 6, hp: 75, speed: 1.55, rewardScore: 60, color: "#38bdf8", name: "UDP-Фрагмент" },
                    { type: "trooper", count: 9, hp: 140, speed: 1.1, rewardScore: 110, color: "#22c55e", name: "Спуфинг-Пакет" }
                ]
            },
            {
                waveNumber: 3,
                name: "Коллапс магистрали: Массивный DDoS-Ботнет",
                spawnInterval: 1000,
                enemies: [
                    { type: "trooper", count: 10, hp: 160, speed: 1.15, rewardScore: 120, color: "#22c55e", name: "DDoS-Агент" },
                    { type: "tank", count: 5, hp: 320, speed: 0.8, rewardScore: 200, color: "#f59e0b", name: "BGP-Аномалия" },
                    { type: "boss", count: 1, hp: 1350, speed: 0.5, rewardScore: 800, color: "#e11d48", isBoss: true, name: "Босс: 100Gbps DDoS Ботнет" }
                ]
            }
        ],
        questions: [
            {
                id: "q2-1",
                difficulty: "easy",
                cardId: "b2-plasma",
                turretType: "plasma",
                question: "В каком правильном порядке отправляются флаги при трехстороннем рукопожатии TCP (3-way Handshake)?",
                options: [
                    "SYN ➔ SYN-ACK ➔ ACK",
                    "ACK ➔ SYN ➔ FIN",
                    "HELLO ➔ ACCEPT ➔ CONNECT",
                    "SYN ➔ ACK-FIN ➔ RST"
                ],
                correctIndex: 0,
                explanation: "Клиент отправляет флаг SYN (инициация), сервер отвечает SYN-ACK (согласие и синхронизация), клиент шлет ACK (подтверждение), после чего соединение считается открытым (ESTABLISHED)."
            },
            {
                id: "q2-2",
                difficulty: "easy",
                cardId: "b2-plasma",
                turretType: "plasma",
                question: "Какой стандартный сетевой порт по умолчанию используется для защищенного протокола HTTPS?",
                options: [
                    "Порт 80",
                    "Порт 443",
                    "Порт 22",
                    "Порт 53"
                ],
                correctIndex: 1,
                explanation: "Порт 443 зарезервирован IANA для HTTPS (HTTP поверх TLS/SSL). Порт 80 — обычный HTTP, 22 — SSH, 53 — DNS."
            },
            {
                id: "q2-3",
                difficulty: "easy",
                cardId: "b2-plasma",
                turretType: "plasma",
                question: "К какому уровню модели OSI относится протокол IP (Internet Protocol)?",
                options: [
                    "Канальный уровень (Data Link, Layer 2)",
                    "Сетевой уровень (Network, Layer 3)",
                    "Транспортный уровень (Transport, Layer 4)",
                    "Прикладной уровень (Application, Layer 7)"
                ],
                correctIndex: 1,
                explanation: "IP работает на 3-м (сетевом) уровне OSI, отвечая за логическую адресацию и маршрутизацию пакетов между подсетями."
            },
            {
                id: "q2-4",
                difficulty: "easy",
                cardId: "b2-plasma",
                turretType: "plasma",
                question: "Какой флаг TCP отправляется для принудительного и немедленного сброса разорванного соединения?",
                options: [
                    "RST (Reset)",
                    "FIN (Finish)",
                    "URG (Urgent)",
                    "PSH (Push)"
                ],
                correctIndex: 0,
                explanation: "Флаг RST указывает на немедленный аварийный сброс сессии без ожидания закрытия потоков данных."
            },
            {
                id: "q2-5",
                difficulty: "medium",
                cardId: "b2-cryo",
                turretType: "cryo",
                question: "Почему для онлайн-игр и стриминга аудио часто предпочитают UDP, а не TCP?",
                options: [
                    "UDP автоматически шифрует трафик на лету",
                    "В UDP нет задержек на рукопожатие, подтверждение доставки и повторную пересылку потерянных пакетов",
                    "UDP пакеты могут иметь бесконечный размер MTU",
                    "TCP запрещен интернет-провайдерами для мультимедиа"
                ],
                correctIndex: 1,
                explanation: "В играх и аудио устаревший пакет не имеет ценности. Отсутствие механизма повторной передачи (retransmission) и окна подтверждений в UDP обеспечивает минимальный пинг."
            },
            {
                id: "q2-6",
                difficulty: "medium",
                cardId: "b2-artillery",
                turretType: "artillery",
                question: "Какая ресурсная запись DNS сопоставляет доменное имя с адресом стандарта IPv6?",
                options: [
                    "A-запись",
                    "AAAA-запись («Quad-A»)",
                    "CNAME-запись",
                    "MX-запись"
                ],
                correctIndex: 1,
                explanation: "Запись AAAA хранит 128-битный IPv6 адрес (в 4 раза длиннее 32-битного IPv4, поэтому AAAA)."
            },
            {
                id: "q2-7",
                difficulty: "medium",
                cardId: "b2-artillery",
                turretType: "artillery",
                question: "Что означает параметр TTL (Time to Live) в ответе DNS-сервера?",
                options: [
                    "Время в секундах, на протяжении которого клиенту и промежуточным резолверам разрешено кэшировать данный ответ",
                    "Количество оставшихся попыток повторить запрос к авторитетному серверу",
                    "Максимальное число маршрутизаторов на пути до веб-сайта",
                    "Срок действия SSL-сертификата домена"
                ],
                correctIndex: 0,
                explanation: "TTL в DNS задает срок валидности записи в кэше в секундах. Пока TTL не истек, повторные запросы отдаются прямо из кэша без обращения к авторитетному серверу."
            },
            {
                id: "q2-8",
                difficulty: "medium",
                cardId: "b2-artillery",
                turretType: "artillery",
                question: "Для чего используется DNS-запись типа CNAME?",
                options: [
                    "Для указания IP-адреса почтового сервера",
                    "Для создания канонического псевдонима одного доменного имени на другое доменное имя",
                    "Для хранения публичного ключа шифрования SSH",
                    "Для обратного преобразования IP в имя (PTR)"
                ],
                correctIndex: 1,
                explanation: "CNAME (Canonical Name) алиасит одно доменное имя к другому (например, `blog.example.com` указывает на `example.github.io`)."
            },
            {
                id: "q2-9",
                difficulty: "hard",
                cardId: "b2-cryo",
                turretType: "cryo",
                question: "В чем суть амплификационной DDoS-атаки через DNS или NTP?",
                options: [
                    "Атакующий шлет запрос с поддельным IP жертвы к уязвимому серверу, и тот возвращает жертве ответ, в десятки раз превышающий по размеру запрос",
                    "Взлом корневых серверов интернета с подменой таблиц зон",
                    "Физическое повреждение оптического кабеля высокой нагрузкой",
                    "Перегрузка DNS-сервера слишком длинными доменными именами"
                ],
                correctIndex: 0,
                explanation: "UDP позволяет легко подделать (спуфить) IP отправителя. Отправив короткий запрос (например `ANY`), атакующий заставляет сервер отправить на IP жертвы огромный ответ (усиление в 50-100 раз)."
            },
            {
                id: "q2-10",
                difficulty: "hard",
                cardId: "b2-plasma",
                turretType: "plasma",
                question: "Что такое механизм TCP Window (размер скользящего окна) и для чего он нужен?",
                options: [
                    "Графический интерфейс в ОС Windows для просмотра сетевой карты",
                    "Механизм управления потоком данных (Flow Control), определяющий сколько байт получатель готов принять без подтверждения (ACK)",
                    "Таймаут закрытия неактивных вкладок в браузере",
                    "Размер буфера видеокарты для сетевой графики"
                ],
                correctIndex: 1,
                explanation: "TCP Window Size сообщает отправителю текущую емкость приемного буфера получателя, предотвращая переполнение памяти медленного узла быстрым потоком данных."
            },
            {
                id: "q2-11",
                difficulty: "hard",
                cardId: "b2-super",
                turretType: "super",
                question: "Каким образом маршрутизация BGP Anycast помогает отражать мощные распределенные DDoS-атаки?",
                options: [
                    "Она полностью отключает интернет в стране источника атаки",
                    "Несколько географически распределенных дата-центров анонсируют одинаковый IP, благодаря чему трафик ботнета локализуется и поглощается ближайшими узлами",
                    "Она блокирует все входящие UDP-пакеты на аппаратном уровне",
                    "Она автоматически переводит весь трафик на IPv6"
                ],
                correctIndex: 1,
                explanation: "Anycast позволяет разным серверам в мире иметь один IP. Маршрутизаторы направляют трафик на топологически ближайший узел, распыляя гигантскую атаку на десятки центров очистки трафика."
            },
            {
                id: "q2-12",
                difficulty: "hard",
                cardId: "b2-super",
                turretType: "super",
                question: "Что происходит при превышении размера IP-пакета над максимальным размером блока передачи (MTU, обычно 1500 байт), если установлен флаг DF (Don't Fragment)?",
                options: [
                    "Маршрутизатор отбрасывает пакет и отправляет отправителю сообщение ICMP 'Fragmentation Needed'",
                    "Пакет сжимается алгоритмом GZIP прямо в кабеле",
                    "Маршрутизатор игнорирует флаг DF и разбивает пакет на части",
                    "Пакет дублируется по всем альтернативным маршрутам"
                ],
                correctIndex: 0,
                explanation: "Если флаг DF=1 (не фрагментировать), роутер обязан сбросить пакет и вернуть ICMP Type 3 Code 4 (Fragmentation Needed and DF set), что лежит в основе алгоритма Path MTU Discovery (PMTUD)."
            }
        ]
    },

    // ==========================================
    // LEVEL 3: WEB API & AUTH (REST, JWT, CORS)
    // ==========================================
    {
        id: "level-3",
        title: "Уровень 3: Web API & Авторизация (REST, JWT, CORS)",
        description: "Защитите микросервисный кластер от атак подделки токенов, алгоритмических обходов цифровой подписи и несанкционированных междоменных вызовов.",
        mapTheme: "api-purple",
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
            { id: "s3-1", x: 180, y: 100 },
            { id: "s3-2", x: 180, y: 260 },
            { id: "s3-3", x: 470, y: 380 },
            { id: "s3-4", x: 470, y: 530 },
            { id: "s3-5", x: 730, y: 60 },
            { id: "s3-6", x: 730, y: 220 },
            { id: "s3-7", x: 730, y: 480 },
            { id: "s3-8", x: 920, y: 320 }
        ],
        briefing: [
            {
                id: "b3-plasma",
                turretType: "plasma",
                turretName: "REST Gateway Турель (Быстрая)",
                title: "1. Архитектура RESTful API & Идемпотентность HTTP",
                content: "REST использует стандартные глаголы HTTP: GET (чтение), POST (создание), PUT (полная замена), PATCH (частичное обновление), DELETE (удаление). Идемпотентным называется метод, повторный вызов которого с теми же параметрами дает тот же результат на сервере (GET, PUT, DELETE — идемпотентны, POST — нет).",
                formula: "PUT /api/v1/users/42 (Идемпотентен) vs POST /api/v1/orders (Не идемпотентен)"
            },
            {
                id: "b3-cryo",
                turretType: "cryo",
                turretName: "JWT Валидатор (Замедляющая)",
                title: "2. JWT (JSON Web Token) & Безопасность подписи",
                content: "JWT состоит из 3 частей, разделенных точками: Header.Payload.Signature. Защиту обеспечивает криптографическая подпись (HMAC-SHA256 или RSA/ECDSA). Критическая уязвимость: алгоритм 'none' (alg=none), при котором сервер доверяет неподписанному токену. Хранить access токен рекомендуется в памяти приложения или HttpOnly Secure SameSite Cookie, но не в открытом localStorage.",
                formula: "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0In0.4af6bc8e... (Base64Url)"
            },
            {
                id: "b3-artillery",
                turretType: "artillery",
                turretName: "CORS Инспектор (AoE-Урон)",
                title: "3. CORS (Cross-Origin Resource Sharing) & Preflight",
                content: "Браузерная политика Same-Origin Policy (SOP) блокирует доступ JS к ответам других источников (протокол, домен, порт). Механизм CORS позволяет серверу разрешать доступ через заголовки 'Access-Control-Allow-Origin'. Для не-простых запросов (с кастомными заголовками или PUT/DELETE) браузер шлет предварительный Preflight-запрос методом OPTIONS.",
                formula: "OPTIONS /api/data ➔ 204 No Content; Access-Control-Allow-Origin: https://app.com"
            },
            {
                id: "b3-super",
                turretType: "super",
                turretName: "Протокол «Супер-удар» (OAuth 2.0 PKCE)",
                title: "4. OAuth 2.0, OpenID Connect & Защита с PKCE",
                content: "OAuth 2.0 — фреймворк авторизации, а OIDC — надстройка аутентификации (ID-токен). Для Single Page Applications (SPA) и мобильных клиентов обязателен Authorization Code Flow с расширением PKCE (Code Verifier + Code Challenge), защищающий код авторизации от перехвата на устройстве.",
                formula: "Code_Challenge = Base64Url(SHA256(Code_Verifier))"
            }
        ],
        waves: [
            {
                waveNumber: 1,
                name: "Спуфинг шлюза: Поддельные JWT токены",
                spawnInterval: 1200,
                enemies: [
                    { type: "scout", count: 10, hp: 75, speed: 1.55, rewardScore: 60, color: "#a855f7", name: "Alg-None Пакет" }
                ]
            },
            {
                waveNumber: 2,
                name: "Междоменная эксфильтрация: CORS Exploit",
                spawnInterval: 1050,
                enemies: [
                    { type: "scout", count: 8, hp: 85, speed: 1.6, rewardScore: 70, color: "#a855f7", name: "CORS-Флудер" },
                    { type: "trooper", count: 10, hp: 170, speed: 1.15, rewardScore: 130, color: "#38bdf8", name: "API-Брутфорсер" }
                ]
            },
            {
                waveNumber: 3,
                name: "Штурм Микросервисов: Zero-Day Token Cracker",
                spawnInterval: 950,
                enemies: [
                    { type: "trooper", count: 12, hp: 190, speed: 1.2, rewardScore: 140, color: "#38bdf8", name: "Token-Инжектор" },
                    { type: "tank", count: 6, hp: 380, speed: 0.8, rewardScore: 240, color: "#ef4444", name: "Спуф-Шлюз" },
                    { type: "boss", count: 1, hp: 1650, speed: 0.48, rewardScore: 1000, color: "#ec4899", isBoss: true, name: "Босс: JWT-Cracker Mastermind" }
                ]
            }
        ],
        questions: [
            {
                id: "q3-1",
                difficulty: "easy",
                cardId: "b3-plasma",
                turretType: "plasma",
                question: "Какой HTTP-код состояния означает успешное создание нового ресурса на сервере?",
                options: [
                    "200 OK",
                    "201 Created",
                    "204 No Content",
                    "304 Not Modified"
                ],
                correctIndex: 1,
                explanation: "Код 201 Created сообщает об успешном завершении запроса (обычно POST) и фактическом создании нового ресурса на сервере."
            },
            {
                id: "q3-2",
                difficulty: "easy",
                cardId: "b3-plasma",
                turretType: "plasma",
                question: "Какой из перечисленных HTTP-методов НЕ является идемпотентным?",
                options: [
                    "GET",
                    "PUT",
                    "DELETE",
                    "POST"
                ],
                correctIndex: 3,
                explanation: "POST создает новый ресурс при каждом вызове (N запросов создадут N ресурсов), в то время как повторный вызов PUT или DELETE оставляет состояние сервера эквивалентным."
            },
            {
                id: "q3-3",
                difficulty: "easy",
                cardId: "b3-plasma",
                turretType: "plasma",
                question: "Что означает код ответа HTTP 401 Unauthorized?",
                options: [
                    "У пользователя нет прав доступа к ресурсу (доступ запрещен)",
                    "Запрос требует аутентификации (пользователь не вошел в систему или токен не валиден)",
                    "Ресурс не найден на сервере",
                    "Превышен лимит запросов Rate Limit"
                ],
                correctIndex: 1,
                explanation: "401 означает отсутствие или недействительность аутентификационных данных. 403 Forbidden означает, что личность подтверждена, но прав недостаточно."
            },
            {
                id: "q3-4",
                difficulty: "easy",
                cardId: "b3-plasma",
                turretType: "plasma",
                question: "Из скольких частей, разделенных точками, состоит стандартный JSON Web Token (JWT)?",
                options: [
                    "2 части (Header, Payload)",
                    "3 части (Header, Payload, Signature)",
                    "4 части (Header, Claims, Crypto, Salt)",
                    "1 монолитная зашифрованная строка"
                ],
                correctIndex: 1,
                explanation: "JWT состоит из трех частей в кодировке Base64Url: Заголовок (Header), Полезная нагрузка (Payload) и Цифровая подпись (Signature)."
            },
            {
                id: "q3-5",
                difficulty: "medium",
                cardId: "b3-cryo",
                turretType: "cryo",
                question: "В чем заключается критическая уязвимость JWT с алгоритмом `alg: 'none'`?",
                options: [
                    "Токен передается без шифрования TLS",
                    "Сервер считает токен валидным вообще без проверки цифровой подписи, позволяя клиенту изменить права на admin",
                    "Токен не имеет срока действия (exp)",
                    "Токен автоматически удаляется браузером"
                ],
                correctIndex: 1,
                explanation: "Если бэкенд не проверяет белый список алгоритмов, злоумышленник может указать `alg: none`, стереть подпись и изменить payload на роль администратора."
            },
            {
                id: "q3-6",
                difficulty: "medium",
                cardId: "b3-cryo",
                turretType: "cryo",
                question: "Почему хранить чувствительные токены доступа (Access Token) в `localStorage` браузера считается опасным?",
                options: [
                    "LocalStorage стирается при каждой перезагрузке страницы",
                    "Любой внедренный вредоносный JavaScript (XSS-атака) может легко прочитать токены из `window.localStorage`",
                    "LocalStorage ограничен размером в 128 байт",
                    "Токены в LocalStorage не поддерживают кириллицу"
                ],
                correctIndex: 1,
                explanation: "Доступ к LocalStorage не защищен флагом HttpOnly. Любой XSS-скрипт получает полный доступ к `window.localStorage.getItem('token')` и может украсть сессию."
            },
            {
                id: "q3-7",
                difficulty: "medium",
                cardId: "b3-artillery",
                turretType: "artillery",
                question: "Какой HTTP-метод браузер автоматически отправляет в качестве Preflight-запроса перед отправкой сложного CORS-запроса?",
                options: [
                    "HEAD",
                    "TRACE",
                    "OPTIONS",
                    "CONNECT"
                ],
                correctIndex: 2,
                explanation: "Браузер отправляет запрос методом OPTIONS с заголовками `Access-Control-Request-Method` и `Access-Control-Request-Headers` для проверки разрешений сервера."
            },
            {
                id: "q3-8",
                difficulty: "medium",
                cardId: "b3-artillery",
                turretType: "artillery",
                question: "Что произойдет, если сервер вернет заголовок `Access-Control-Allow-Origin: *` при запросе с флагом `credentials: 'include'` (с отправкой cookies)?",
                options: [
                    "Cookies будут безопасно доставлены серверу",
                    "Браузер заблокирует ответ и выдаст ошибку CORS, так как wildcard `*` запрещен вместе с передачей учетных данных (credentials)",
                    "Сервер перезагрузится с ошибкой 500",
                    "Браузер отключит Same-Origin Policy для всей вкладки"
                ],
                correctIndex: 1,
                explanation: "Спецификация CORS строго запрещает значение `*` в `Access-Control-Allow-Origin`, если `Access-Control-Allow-Credentials: true`. Должен быть указан точный доверенный домен."
            },
            {
                id: "q3-9",
                difficulty: "hard",
                cardId: "b3-cryo",
                turretType: "cryo",
                question: "В чем разница между симметричным алгоритмом подписи HS256 и асимметричным RS256 в JWT?",
                options: [
                    "HS256 использует один и тот же секретный ключ для подписи и проверки, а RS256 — пару приватного и публичного ключей",
                    "HS256 работает только по протоколу HTTP, а RS256 — по HTTPS",
                    "RS256 шифрует сам payload, а HS256 нет",
                    "HS256 генерирует токен длиной ровно 256 бит"
                ],
                correctIndex: 0,
                explanation: "При RS256 сервер авторизации подписывает токен приватным ключом, а любой микросервис может безопасно проверять подпись общедоступным публичным ключом без риска компрометации секрета."
            },
            {
                id: "q3-10",
                difficulty: "hard",
                cardId: "b3-super",
                turretType: "super",
                question: "Какую уязвимость решает расширение PKCE (Proof Key for Code Exchange) в протоколе OAuth 2.0?",
                options: [
                    "Предотвращает перехват кода авторизации (Authorization Code) сторонними вредоносными приложениями на устройстве клиента",
                    "Ускоряет генерацию токенов за счет сжатия GZIP",
                    "Отменяет необходимость использования HTTPS",
                    "Автоматически сбрасывает пароль пользователя каждые 30 дней"
                ],
                correctIndex: 0,
                explanation: "В публичных клиентах (SPA, мобайл) злоумышленник мог перехватить код авторизации через custom URI scheme. PKCE требует отправки `code_verifier`, известного только настоящему инициатору."
            },
            {
                id: "q3-11",
                difficulty: "hard",
                cardId: "b3-artillery",
                turretType: "artillery",
                question: "Что такое атака «Algorithm Confusion» (путаница алгоритмов) на JWT токены?",
                options: [
                    "Случайный сбой в микропроцессоре сервера",
                    "Атакующий меняет алгоритм с асимметричного RS256 на симметричный HS256, подписывая токен публичным ключом сервера, который сервер ошибочно использует как секретный ключ HMAC",
                    "Отправка токена задом наперед для вызова переполнения буфера",
                    "Шифрование токена алгоритмом MD5"
                ],
                correctIndex: 1,
                explanation: "Если сервер ожидает RS256, но доверяет полю `alg` в токене, атакующий указывает `HS256` и подписывает токен публичным ключом сервера (который общедоступен!). Неуязвимая библиотека проверяет подпись публичным ключом через HMAC и принимает её как валидную."
            },
            {
                id: "q3-12",
                difficulty: "hard",
                cardId: "b3-super",
                turretType: "super",
                question: "Что представляет собой стандарт OpenID Connect (OIDC) по отношению к протоколу OAuth 2.0?",
                options: [
                    "OIDC — это протокол аутентификации (проверки личности) и получения ID-токена, построенный поверх авторизационного фреймворка OAuth 2.0",
                    "OIDC заменяет протокол TCP на UDP для API",
                    "OIDC — это формат базы данных для хранения паролей",
                    "OIDC запрещает использование JSON Web Tokens"
                ],
                correctIndex: 0,
                explanation: "OAuth 2.0 предназначен строго для авторизации (делегирования доступа). OIDC добавляет слой аутентификации (кто есть пользователь) через структурированный `id_token` и конечную точку `UserInfo`."
            }
        ]
    }
];

// Helper to get level by ID or index
function getLevelConfig(idOrIndex) {
    if (typeof idOrIndex === "number") {
        return GAME_LEVELS[idOrIndex] || GAME_LEVELS[0];
    }
    return GAME_LEVELS.find(l => l.id === idOrIndex) || GAME_LEVELS[0];
}
