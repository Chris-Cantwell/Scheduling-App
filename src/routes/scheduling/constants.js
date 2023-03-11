export const TIMEZONES = [
    { value: 0, display: 'Eastern Standard Time', selected: true },
    { value: -5, display: 'Hawaii' },
    { value: -4, display: 'Alaska' },
    { value: -3, display: 'Pacific Time' },
    { value: -2, display: 'Mountain Time' },
    { value: -1, display: 'Central Time' },
    { value: 1, display: 'Atlantic Time' },
    { value: 2, display: 'Greenland; Buenos Aires' },
    { value: 4, display: 'Cape Verde' },
    { value: 5, display: 'GMT/UTC' },
    { value: 6, display: 'Central European Time' },
    { value: 7, display: 'Eastern European Time' },
    { value: 8, display: 'Arabia Standard Time' },
    { value: 13, display: 'China Standard Time' },
]

// Return true if time is within interval
export const compareTimes = (hr, min, sHr, sMin, eHr, eMin) => {
    const start = hr == sHr ? sMin <= min : sHr < hr;
    const end = hr == eHr ? min < eMin : hr < eHr;

    return start && end;
}