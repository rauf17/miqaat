import { expect, test, describe } from 'vitest';
import { getEventDate, MAJOR_EVENTS } from './events';

describe('Hijri Events Calculator', () => {
  test('calculates correct events for Hijri Year 1445', () => {
    // 1445 Ramadan 1 is ~ March 11, 2024 (Umm al-Qura)
    const ramadan1445 = getEventDate(1445, MAJOR_EVENTS.find(e => e.name === 'Ramadan Begins')!);
    expect(ramadan1445).not.toBeNull();
    // Using UTC date to compare since local timezone might shift the date by 1
    // March 11 is 2024-03-11. We use getFullYear(), getMonth(), getDate() to verify local time correctness
    expect(ramadan1445!.getFullYear()).toBe(2024);
    expect(ramadan1445!.getMonth()).toBe(2); // March
    expect(ramadan1445!.getDate()).toBe(11);
    
    // 1445 Eid al-Fitr (1 Shawwal) is ~ April 10, 2024
    const eidAlFitr1445 = getEventDate(1445, MAJOR_EVENTS.find(e => e.name === 'Eid al-Fitr')!);
    expect(eidAlFitr1445).not.toBeNull();
    expect(eidAlFitr1445!.getFullYear()).toBe(2024);
    expect(eidAlFitr1445!.getMonth()).toBe(3); // April
    expect(eidAlFitr1445!.getDate()).toBe(10);
  });

  test('calculates correct events for Hijri Year 1446', () => {
    // 1446 Ramadan 1 is ~ March 1, 2025
    const ramadan1446 = getEventDate(1446, MAJOR_EVENTS.find(e => e.name === 'Ramadan Begins')!);
    expect(ramadan1446).not.toBeNull();
    expect(ramadan1446!.getFullYear()).toBe(2025);
    expect(ramadan1446!.getMonth()).toBe(2); // March
    expect(ramadan1446!.getDate()).toBe(1);

    // 1446 Eid al-Fitr is ~ March 30, 2025
    const eidAlFitr1446 = getEventDate(1446, MAJOR_EVENTS.find(e => e.name === 'Eid al-Fitr')!);
    expect(eidAlFitr1446).not.toBeNull();
    expect(eidAlFitr1446!.getFullYear()).toBe(2025);
    expect(eidAlFitr1446!.getMonth()).toBe(2); // March
    expect(eidAlFitr1446!.getDate()).toBe(30);
  });

  test('calculates correct events for Hijri Year 1447', () => {
    // 1447 Ashura (10 Muharram) is ~ July 5, 2025
    const ashura1447 = getEventDate(1447, MAJOR_EVENTS.find(e => e.name === 'Ashura')!);
    expect(ashura1447).not.toBeNull();
    expect(ashura1447!.getFullYear()).toBe(2025);
    expect(ashura1447!.getMonth()).toBe(6); // July
    expect(ashura1447!.getDate()).toBe(5);
  });
});
