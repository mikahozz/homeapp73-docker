/* For a given date, get the ISO week number
 *
 * Based on information at:
 *
 *    http://www.merlyn.demon.co.uk/weekcalc.htm#WNR
 *
 * Algorithm is to find nearest thursday, it's year
 * is the year of the week number. Then get weeks
 * between that date and the first day of that year.
 *
 * Note that dates in one year can be weeks of previous
 * or next year, overlap is up to 3 days.
 *
 * e.g. 2014/12/29 is Monday in week  1 of 2015
 *      2012/1/1   is Sunday in week 52 of 2011
 */
function getYearWeekNumber(d: Date): number {
  // Copy date so don't modify original
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  // Set to nearest Thursday: current date + 4 - current day number
  // Make Sunday's day number 7
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  // Get first day of year
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  // Calculate full weeks to nearest Thursday
  const weekNo = Math.ceil(
    ((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
  );
  // Return week number
  return weekNo;
}

interface DataObject {
  date: string;
  [key: string]: string | number | boolean | null | undefined;
}

function groupByMonthWeek(data: DataObject[]) {
  const grouped: {
    [year: string]: {
      [month: string]: {
        [week: string]: DataObject[];
      };
    };
  } = {};

  data.forEach((o) => {
    const year = new Date(o.date).getFullYear();
    const month = new Date(o.date).getMonth();
    const week = getYearWeekNumber(new Date(o.date));
    if (!grouped[year]) {
      grouped[year] = {};
    }
    if (!grouped[year][month]) {
      grouped[year][month] = {};
    }
    if (!grouped[year][month][week]) {
      grouped[year][month][week] = [];
    }
    grouped[year][month][week].push(o);
  });
  return grouped;
}

export { getYearWeekNumber, groupByMonthWeek };
