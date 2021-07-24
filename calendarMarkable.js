class Calendar {

    elem;
    selectedDate;

    options = {
        lang: 'en',

        customMonths: null,

        sundayIndex: 0,
        weekDays: true,
        customWeekDays: null,

        selectedDate: new Date(),

        onChange: null,
    };

    _selectedTDs = {
        'day': null,
        'hour': null,
        'month': null
    };

    _level = 0;

    _calendarDays;
    _calendarMonths;
    _calendarHours;

    _calendarDaysTDs;
    _calendarMonthsTDs;
    _calendarHoursTDs;

    _monthNames;

    static monthsNames = {
        'en': [
            'January', 'February',
            'March', 'April', 'May',
            'June', 'July', 'August',
            'September', 'October', 'November',
            'December'
        ],
        'ru': [
            'Январь', 'Февраль',
            'Март', 'Апрель', 'Май',
            'Июнь', 'Июль', 'Август',
            'Сентябрь', 'Октябрь', 'Ноябрь',
            'Декабрь'
        ]
    };

    static weekDaysNames = {
        'en': [
            'Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'
        ],
        'ru': [
            'ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'
        ]
    };

    constructor(elem, options = {}) {
        this.elem = elem;

        let optionsKeys = Object.keys(options);
        for (let i = 0; i < optionsKeys.length; i++) this.options[optionsKeys[i]] = options[optionsKeys[i]];

        this.selectedDate = this.options['selectedDate'];
        this.onChange = this.options["onChange"];
        this._buildCalendar();

        this.selectDate(this.selectedDate);
    }

    selectDate(date) {
        this.selectMonth(date.getMonth(), false, false);
        this.selectDay(date.getDate(), false);
        this.selectHour(date.getHours());
    }

    selectDay(day, changeInvoke = true) {
        this.selectedDate.setDate(day);
        let cell = this._getDayCell(day);
        this.selectCell(cell, "day", true, changeInvoke);
    }

    selectMonth(month, update_days = true, changeInvoke = true) {
        this.selectedDate.setMonth(month);
        let cell = this._getMonthCell(month);
        this.selectCell(cell, "month", update_days, changeInvoke);
    }

    selectHour(hour, changeInvoke = true) {
        this.selectedDate.setHours(hour);
        let cell = this._getHourCell(hour);
        this.selectCell(cell, "hour" , true, changeInvoke);
    }

    selectCell(td, dataType, extraUpd = true, changeInvoke = true) {
        if (td.length === 0) return;
        td.attr('selected', true);

        if (dataType === 'day') {
            this.selectedDate.setDate(Number(td.attr('value')));
        }
        if (dataType === 'month') {
            let day = this.selectedDate.getDate();
            let month = Number(td.attr('value'));
            let daysInNewMonth = Calendar._getDaysInMonth(month, this.selectedDate.getFullYear());
            if (day > daysInNewMonth) {
                this.selectedDate.setDate(daysInNewMonth);
            }
            this.selectedDate.setMonth(month);
            if (extraUpd) {
                this._buildDaysTable(this.selectedDate.getMonth(), this.selectedDate.getFullYear());
                this.selectDay(this.selectedDate.getDate());
                changeInvoke = false;
            }

        }
        if (dataType === 'hour') {
            this.selectedDate.setHours(Number(td.attr('value')));
        }

        if (this._selectedTDs[dataType] !== null) {
            this._selectedTDs[dataType].attr('selected', false);
        }
        this._selectedTDs[dataType] = td;
        if (changeInvoke) this._changeInvoke();
    }

    _changeInvoke() {
        if (this.options['onChange'] !== null) this.options['onChange'](this.selectedDate);
    }

    _getDayCell(day) {
        return this._calendarDaysTDs.filter(`[value='${day}']`).first();
    }

    _getMonthCell(month) {
        return this._calendarMonthsTDs.filter(`[value='${month}']`).first();
    }

    _getHourCell(hour) {
        return this._calendarHoursTDs.filter(`[value='${hour}']`).first();
    }

    _buildCalendar() {
        if (this.options['weekDays']) this._buildWeekDays();
        this._buildDaysTable(this.selectedDate.getMonth(), this.selectedDate.getFullYear());
        this._buildMonthTable();
        this._buildHoursTable();
    }

    _buildMonthTable() {
        this._calendarMonths = this.elem.find($(".calendar_months"));
        this._calendarMonths.css("height", this._calendarDays.height());
        this._calendarMonths.html("");
        if (this._calendarMonths.length === 0) return;

        let month_names;
        month_names = this.options['customMonths'] === null ?
            Calendar.monthsNames[this.options['lang']] : this.options['customMonths'];
        if (month_names.length !== 12) {
            console.error("customMonths must have 12 elements");
            return;
        }
        this._monthNames = month_names;

        for (let i = 0; i < 12; i++) {
            this._calendarMonths.append("<tr><td value='" + i + "'>" + month_names[i] + "</td></tr>");
        }
        this._bindMonthTD();
    }

    _bindMonthTD() {
        this._calendarMonthsTDs = this._calendarMonths.find($("td:not([disabled])"));
        let inst = this;
        this._calendarMonthsTDs.click(function () {
            if (!inst._clickTD($(this))) return;
            inst.selectCell($(this), 'month');
        });
    }

    _buildWeekDays() {
        this._calendarDays = this.elem.find($(".calendar_days"));
        this._calendarDays.html("");
        if (this._calendarDays.length === 0) return;

        if (this.options['weekDays']) {
            let weekDaysNames = this.options['customWeekDays'] === null ?
                Calendar.weekDaysNames[this.options["lang"]] : this.options['customWeekDays'];
            if (weekDaysNames.length !== 7) {
                console.error("customWeekDays must have 7 elements");
                return;
            }

            let day_table_header = "";
            let sundayIndex = this.options["sundayIndex"];
            for (let i = 0; i < 7; i++) {
                day_table_header += '<th>' + weekDaysNames[(i + (7 - sundayIndex)) % 7] + '</th>'
            }
            this._calendarDays.append("<tr>" + day_table_header + "</tr>");
        }
    }

    _buildDaysTable(month, year) {
        this._calendarDays = this.elem.find($(".calendar_days"));
        let weekDays = this._calendarDays.find($("tr th")).first().parent();
        this._calendarDays.html(weekDays);

        let day_table_days = "";
        let date = new Date(year, month, 1);
        let daysInMonth = Calendar._getDaysInMonth(date.getMonth(), date.getFullYear());
        let tempWeekDay = this._getDayOfWeek(date);

        day_table_days += "<tr>";
        let row = 0;
        for (let i = 0; i < tempWeekDay; i++) day_table_days += "<td disabled></td>";
        for (let i = 1; i <= daysInMonth; i++) {
            day_table_days += "<td value='" + i + "'>" + i + "</td>";

            tempWeekDay++;
            if (tempWeekDay === 7) {
                tempWeekDay = 0;
                row++;
                day_table_days += "</tr><tr>"
            }
        }
        for (let i = 0; i < (7-tempWeekDay); i++) day_table_days += "<td disabled></td>";
        day_table_days += "</tr>";
        if (row === 4) {
            day_table_days += "<tr>";
            for (let i = 0; i < 7; i++) day_table_days += "<td style='opacity:0; cursor: default;' disabled>0</td>";
            day_table_days += "</tr>";
        }
        this._calendarDays.append(day_table_days);
        this._bindDayTD();
    }

    _bindDayTD() {
        this._calendarDaysTDs = this._calendarDays.find($("td:not([disabled])"));
        let inst = this;
        this._calendarDaysTDs.click(function () {
            if (!inst._clickTD($(this))) return;
            inst.selectCell($(this), 'day');
        });
    }


    _buildHoursTable() {
        this._calendarHours = this.elem.find($(".calendar_hours"));
        this._calendarHours.html("");
        this._calendarHours.css({
            height: this._calendarDays.height(),
            width: this._calendarMonths.width(),
        });
        if (this._calendarHours.length === 0) return;

        let hours_table_str = "";
        for (let i = 0; i < 24; i++) {
            hours_table_str += "<tr><td value='" + i +  "'>" + Calendar._numberWithZero(i) + ":00" + "</td></tr>"
        }
        this._calendarHours.append(hours_table_str);
        this._bindHourTD();
    }

    _bindHourTD() {
        this._calendarHoursTDs = this._calendarHours.find($("td:not([disabled])"));
        let inst = this;
        this._calendarHoursTDs.click(function () {
            if (!inst._clickTD($(this))) return;
            inst.selectCell($(this), 'hour');
        });
    }

    _clickTD(td) {
        if (td.attr('disabled') === 'disabled') {
            td.unbind();
            return false;
        }
        if (td.attr('selected') === 'selected') return false;
        return true;
    }

    _getDayOfWeek(date) {
        return ((date.getDay() + this.options['sundayIndex']) % 7);
    }

    static _getDaysInMonth(month, year) {
        return new Date(year, month + 1, 0).getDate();
    }

    static _numberWithZero(number) {
        return number < 10 ? "0" + number : "" + number;
    }
}

class CalendarMarkable extends Calendar {
    _markedDatePeriods = [];

    /*
    _markedDatePeriods[i] = {
        start: Date,
        end: Date,
        classNames: string[],
        level: int (0 - hours; 1 - days; 2 - months)
    }
    */

    static options = {
      onClassesAdded: function (classes) {return classes},
    };

    constructor(elem, options = {}) {
        super(elem, options);
        this.options = Object.assign({}, this.options, CalendarMarkable.options);
        let optionsKeys = Object.keys(options);
        for (let i = 0; i < optionsKeys.length; i++) this.options[optionsKeys[i]] = options[optionsKeys[i]];
    }

    _buildDaysTable(month, year) {
        super._buildDaysTable(month, year);
    }

    _changeInvoke() {
        if (typeof this._markedDatePeriods !== 'undefined') this._markTDs();
        super._changeInvoke();
    }

    markDatePeriod(startDate, endDate, classNames) {
        this._markedDatePeriods.push({
            start: startDate,
            end: endDate,
            classNames: classNames,
        });
        this._markTDs();
    }

    markDate(date, classNames) {
        this.markDatePeriod(date, date, classNames);
    }

    _markTDs() {
        this._markMonthTDs();
        this._markDayTDs();
        this._markHourTDs();
    }

    _markMonthTDs() {
        this._calendarMonthsTDs.removeClass();
        let tempDate = new Date(this.selectedDate.getFullYear(), 1);
        for (let i = 0; i < 12; i++) {
            let markClasses = this._getClassesDate(tempDate, 2);
            if (markClasses !== null) {
                let td = this._calendarMonthsTDs.eq(i);
                this._addClassesToTD(td, markClasses);
            }
            tempDate.setMonth(i+1);
        }
    }

    _markDayTDs() {
        this._calendarDaysTDs.removeClass();
        let tempDate = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), 1);
        for (let i = 0; i < this._calendarDaysTDs.length; i++) {
            let markClasses = this._getClassesDate(tempDate, 1);
            if (markClasses !== null) {
                let td = this._calendarDaysTDs.eq(i);
                this._addClassesToTD(td, markClasses);
            }
            tempDate.setDate(i+2);
        }
    }

    _markHourTDs() {
        this._calendarHoursTDs.removeClass();
        let tempDate = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), this.selectedDate.getDate(), 0);
        for (let i = 0; i < 24; i++) {
            let markClasses = this._getClassesDate(tempDate, 0);
            if (markClasses !== null) {
                let td = this._calendarHoursTDs.eq(i);
                this._addClassesToTD(td, markClasses);
            }
            tempDate.setHours(i+1);
        }
    }

    _addClassesToTD(td, classes) {
        classes = this._addClassesHandler(td, classes);
        if(typeof this.options['onClassesAdded'] !== 'undefined') classes = this.options['onClassesAdded'](classes);
        for (let c = 0; c < classes.length; c++) {
            if (classes[c] === 'disabled') {
                td.attr('disabled', true);
                continue;
            }
            if (classes[c].startsWith("-")) {
                td.removeClass(classes[c].split('-')[1]);
            }
            else {
                td.addClass(classes[c]);
            }
        }
        return classes;
    }

    _addClassesHandler(td, classes) {
        return classes;
    }

    _getClassesDate(date, level) {
        let classes = [];
        if (typeof this._markedDatePeriods === 'undefined') return [];
        for (let i = 0; i < this._markedDatePeriods.length; i++) {
            let period = this._markedDatePeriods[i];
            if (period['start'] === null || period['end'] === null) continue;
            let compare1 = CalendarMarkable._compareDateByLevel(date, period['start'], level);
            let compare2 = CalendarMarkable._compareDateByLevel(date, period['end'], level);
            if ((compare1 === 1 && compare2 === -1) || (compare1 === 0 || compare2 === 0)) {
                if (typeof period['classNames'] === 'string') {
                    classes.push(period['classNames']);
                }
                else {
                    for (let c = 0; c < period['classNames'].length; c++) {
                        classes.push(period['classNames'][c]);
                    }
                }
            }
        }
        return classes;
    }

    static _compareDateByLevel(date1, date2, level) {
        let yearCompare = CalendarMarkable._compareInts(date1.getFullYear(), date2.getFullYear());
        if (level === 3 || yearCompare !== 0) {
            return yearCompare;
        }
        else {
            let monthCompare = CalendarMarkable._compareInts(date1.getMonth(), date2.getMonth());
            if (level === 2 || monthCompare !== 0) {
                return monthCompare;
            }
            else {
                let dayCompare = CalendarMarkable._compareInts(date1.getDate(), date2.getDate());
                if (level === 1 || dayCompare !== 0) {
                    return dayCompare;
                }
                else {
                    let hourCompare = CalendarMarkable._compareInts(date1.getHours(), date2.getHours());
                    if (level === 0 || hourCompare !== 0) {
                        return hourCompare;
                    }
                    else {
                        return hourCompare;
                    }
                }
            }
        }
    }

    static _compareInts(int1, int2) {
        if (int1 === int2) return 0;
        if (int1 < int2) return -1;
        if (int1 > int2) return 1;
    }

    static _editDateByLevel(date, delta, level) {
        if (level === 0) {
            date.setHours(date.getHours() + delta);
        }
        if (level === 1) {
            date.setDate(date.getDate() + delta);
        }
        if (level === 2) {
            date.setMonth(date.getMonth() + delta);
        }
        return date;
    }
}

let calendar = new CalendarMarkable($(".calendar"));

let date = new Date();
let date2 = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 5);
calendar.markDatePeriod(date, date2, "marked_date")