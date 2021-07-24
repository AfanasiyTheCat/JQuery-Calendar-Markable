let calendar = new CalendarMarkable($(".calendar"));

let date = new Date();
let date2 = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 5);
calendar.markDatePeriod(date, date2, "marked_date")