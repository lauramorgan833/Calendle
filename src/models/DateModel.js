// Shared DateModel for the Calendle app
// Provides a small wrapper around JS Date with convenient helpers so the rest
// of the codebase doesn't need to do date transformations everywhere.

export const DAYSOFWEEK = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat']
export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export class DateModel {
    constructor(date = new Date()) {
        // always store an internal Date clone
        this._date = new Date(date);
    }

    // Factory returning a DateModel for 'today'
    static today() { return new DateModel(new Date()); }

    // Return a cloned Date object (so callers can't mutate the internal date)
    currentDate() { return new Date(this._date); }

    // String form
    toString() { return this._date.toString(); }

    // Components
    getYear() { return this._date.getFullYear(); }
    getMonthIndex() { return this._date.getMonth(); } // 0-11
    getDate() { return this._date.getDate(); } // day of month 1-31
    getDayIndex() { return this._date.getDay(); } // 0-6 (Sun-Sat)

    getDateString() { return this.getDate().toString(); }
    getMonthString() { return MONTHS[this.getMonthIndex()]; }
    getDayOfWeekString() { return DAYSOFWEEK[this.getDayIndex()]; }


    // Mutating helpers that return a new DateModel (functional style)
    addDays(n) { const d = new Date(this._date); d.setDate(d.getDate() + n); return new DateModel(d); }

    // Compare to another Date or DateModel
    equals(other) {
        if (!other) return false;
        const t = other instanceof DateModel ? other._date.getTime() : new Date(other).getTime();
        return this._date.getTime() === t;
    }
}