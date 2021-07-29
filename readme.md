# Сборка Gulp v.4.0

## Содержание
 + [Быстрый старт](#setup)
 + [Структура проекта](#file)
 + [Команды запуска](#command)
 + [Библиотеки](#libs)
 + [Подключение файлов](#include)

### <a name="setup"></a> Быстрый старт

+ Установить npm зависимости ```yarn```
+ Запустить проект ```yarn run dev```


### <a name="file"></a> Структура проекта
```
root                                    | Корень проекта
├── gulp                                | Файлы для настроек галпа 
│   ├── tasks                           | Таски для галпа
│   └── config.js                       | Конфигурация проекта
├── src                                 | Исходные файлы
│   ├── blocks                          | БЭМ блоки
│   │   └── block                       | БЭМ Блок
│   │       ├── block.html              | Разметка блока
│   │       ├── block.js                | Скрипт блока
│   │       └── block.scss              | Стили блока
│   ├── fonts                           | Шрифты
│   ├── icons                           | Иконки SVG
│   ├── img                             | Изображения
│   │   └── favicons                    | Фавиконки
│   ├── js                              | JS файлы
│   │   ├── libs                        | Папка со сторонними библиотеками, которых нет в npm
│   │   └── index.js                    | Главный JS файл
│   ├── pages                           | Страницы проекта
│   │   └── index                       | Директория страницы
│   │       ├── index.html              | Разметка страницы
│   │       ├── index.scss              | Файл стилей страницы, в который импортируются нужные стили из блоков
│   │       └── index.js                | Js файл страницы, в который импортируются нужные js файлы из блоков
│   ├── styles                          | Файлы стилей
│   │   ├── animations                  | Анимации
│   │   │   └── index.scss              | Подключение анимаций
│   │   ├── helpers                     | Помощники
│   │   │   ├── base.scss               | Глобальные стили сайта
│   │   │   ├── fonts.scss              | Подключение шрифтов
│   │   │   ├── grid.scss               | Сетка проекта
│   │   │   ├── index.scss              | Подключение файлов-помощников
│   │   │   └── vars.scss               | Переменные
│   │   ├── libs                        | Примеси  
│   │   │   └── index.scss              | Подключение стилей библиотек
│   │   ├── mixins                      | Примеси  
│   │   │   ├── font-face.scss          | Примесь для подключение шрифтов
│   │   │   ├── index.scss              | Подключение файлов-примесей
│   │   │   └── vh-check.scss           | Примесь для правильного расчета 100vh на мобильных устройств
│   │   ├── blocks.scss                 | Общий файл стилей, в который импортируются все стили общих блоков 
│   │   └── common.scss                 | Основной файл стилей, импортирует все остальные стиливые файлы
│   ├── video                           | Видео
│   └── .htaccess                       | Файл настроек сервера
├── .babelrc.js                         | Конфигурация Babel
├── .browserslistrc                     | Список поддерживаемых браузеров
├── .editorconfig                       | Конфигурация редактора
├── .env.example                        | Пример ENV файла
├── .eslintrc                           | Конфигурация ESlint
├── .gitignore                          | Исключенные файлы из git
├── .prettierrc                         | Конфигурация форматирования кода
├── .stylelintignore                    | Исключенные файлы из проверки Stylelint
├── .stylelintrc                        | Концигурация StyleLint
├── gulpfile.babel.js                   | Конфигурация Gulp
├── package.json                        | Список зависимостей 
└── webpack.config.js                   | Конфигурация WebPack

```

### <a name="command"></a> Команды запуска

#### Режим разработки 
```
yarn run dev
```
    
#### Режим продакш
Минифицирует css/ js/ img, так создает json manifest для css и js. Результат сборки папка ```dist ```
    
```
yarn run build
```

#### Запускает проверку линтеров

```
yarn run test
```

#### Автоматически исправляет ошибки линтера

```
yarn run fix
```

## <a name="libs"></a> Коллекция библиотек

+ [vh-check](https://github.com/Hiswe/vh-check) - Утилита для высоты экрана на мобильных устройствах;
    

## <a name="include"></a> Подключение файлов
Подключение js модулей 
```
import var from "~/block-name/file-name.js"
```

Подключения html файлов 
```
@@include('../../blocks/dir-name/file-name.html')
```
Подключение html файлов с передачей данных
```
@@include('../../blocks/dir-name/file-name.html', {
  "key": "value"
})
```

```
@@include('../../blocks/dir-name/file-name.html', '../../blocks/dir-name/data.(js|json)')
```

```
@@loop('../../blocks/dir-name/file-name.html', [
    { "key": "value" },
    { "key": "value" },
])
```

Шаблон подключаемого файла с данными
```
<section>
    <h1>@@key</h1>
</section>
```