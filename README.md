# JQuery Calendar Markable
 
[Codepen Example](https://codepen.io/afanasiythecat/pen/gOWxMor)

- [English](#eng)
- [Русский](#rus)

____
<a name="eng"></a> 
## English
### Usage
- Create a calendar element, inside which you will place three tables with months, days and hours
```html
<div class="calendar">
    <table class="calendar_months"></table>
    <table class="calendar_days"></table>
    <table class="calendar_hours"></table>
</div>
```
- ###### it is recommended to use **core.css** styles, but if you want, you can define your own
- Create an instance of the **Calendar** / **Calendar Markable** class, specify as an argument
```JavaScript
let calendar = new CalendarMarkable($(".calendar"));
```
- To mark dates in **Calendar Markable**, use the public class *[markDatePeriod](#eng_markDatePeriod)*
```JavaScript
let date = new Date();
let date2 = new Date(date.getFullYear(), date.getMonth(),
 date.getDate() + 5);
calendar.markDatePeriod(date, date2, "marked_date")
```
### Class **Calendar**
#### Fields
- elem - calendar element (specified in the constructor)
- selectedDate
#### Methods
- selectDate(date)
- selectDay / selectHour / selectMonth (day/hour/month, changeInvoke = true) - select the day/hour/month on the calendar.
    - If changeInvoke false, the [onChange](#end_onChange) method will not be called
- selectCell(td, dataType, extraUpd = true, changeInvoke = true) - select date by cell.
    - td - cell element
    - dataType = "hour"/"day"/"month" depending on the type of data that the cell represents.
    - If change Invoke false, the [onChange](#end_onChange) method will not be called
#### Constructor options
As a second argument, you can set a number of settings for the calendar:
- lang - language (ru/en)
- customMonths - array of month names (overwrites the default values)
- sundayIndex - sunday index (default 0)
- weekDays - if false, the table header with the name of the days of the week will not be built
- customWeekDays - array of names of days of the week (overwrites the default values)
- selectedDate - the date selected during initialization (by default, today's date is selected)
<a name="end_onChange"></a>
- onChange(date) - the function is called when the selected date changes
#### Styles
- Disabled attribute - the date is not available
- Selected attribute - the date is selected

###### Class **CalendarMarkable**
#### Methods
<a name="eng_markDatePeriod"></a>
- markDatePeriod(StartDate, EndDate, classNames) - mark the period
- StartDate - Start date of the marked period
- endDate - End date of the marked period
- classNames - array of classes that mark the period *(can be a string (one class)*. To delete
class, specify the class with a hyphen at the beginning of "- class_name "
- markDate(date, classNames) - mark the date
#### Constructor options
- onClassesAdded(classes) - called when adding classes
____
## Русский

<a name="rus"></a> 
### Использование
- Создайте элемент календаря, внутри которого расположите три таблицы с месяцами, днями и часами
```html
<div class="calendar">
    <table class="calendar_months"></table>
    <table class="calendar_days"></table>
    <table class="calendar_hours"></table>
</div>
```
- ###### рекомендуется использовать стили **core.css**, но при желании можно определить свои
- Создайте экземпляр класса **Calendar** / **Calendar Markable**, в качестве аргумента указать 
```JavaScript
let calendar = new CalendarMarkable($(".calendar"));
```
- Для маркировки дат в **Calendar Markable** используйте публичный класс *[markDatePeriod](#rus_markDatePeriod)*
```JavaScript
let date = new Date();
let date2 = new Date(date.getFullYear(), date.getMonth(),
 date.getDate() + 5);
calendar.markDatePeriod(date, date2, "marked_date")
```
___
### Класс **Calendar**
#### Поля
- elem - элемент календаря (указыватся в конструкторе)
- selectedDate - выбранная дата
#### Методы
- selectDate(date) - выбрать дату на календаре
- selectDay / selectHour / selectMonth (day/hour/month, changeInvoke = true) - выбрать день/час/месяц на календаре. 
    - При changeInvoke false метод [onChange](#rus_onChange) не будет вызван
- selectCell(td, dataType, extraUpd = true, changeInvoke = true) - выбрать дату по клетке.
    - td - элемент клетки
    - dataType = "hour"/"day"/"month" в зависимости от типа данных, которые представляет клетка.
    - При changeInvoke false метод [onChange](#rus_onChange) не будет вызван
#### Опции конструктора
В качестве второго аргумента можно задать ряд настроек для календаря:
- lang - язык (ru/en)
- customMonths - массив названий месяцев (перезаписывает значения по умолчанию)
- sundayIndex - индекс воскресенья (по умолчанию 0)
- weekDays - если false, заголовок таблицы с названием дней недели не будет построен
- customWeekDays - массив названий дней недели (перезаписывает значения по умолчанию)
- selectedDate - выбранная при инициализации дата (по умолчанию выбирает сегодняшняя дата)
<a name="rus_onChange"></a> 
- onChange(date) - функция вызывается при изменении выбранной даты
#### Стили
- Атрибут disabled - дата недоступна
- Атрибут selected - дата выбрана

___
### Класс **CalendarMarkable**
#### Методы
<a name="rus_markDatePeriod"></a> 
- markDatePeriod(startDate, endDate, classNames) - отметить период
    - startDate - Дата начала отмеченного периода
    - endDate - Дата конца отмеченного пероида
    - classNames - массив классов, которыми отмечается период *(может быть строкой (одним классом)*. Чтобы удалить
    класс, укажите класс с дефисом в начале "-class_name"
- markDate(date, classNames) - отметить дату
#### Опции конструктора
- onClassesAdded(classes) - вызывается при добавлении классов
___