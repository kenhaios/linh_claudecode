// Unit tests for Vietnamese astrology calculations
import { LunarCalendarService } from '../../src/services/vietnamese/lunarCalendarService';
import { ChartGenerationService } from '../../src/services/astrology/chartGenerationService';
import { AstrologyChart } from '../../src/models/AstrologyChart';

describe('Vietnamese Astrology System', () => {
  describe('Lunar Calendar Service', () => {
    it('should convert solar to lunar date correctly', () => {
      const lunarCalendar = new LunarCalendarService();
      const solarDate = new Date('1990-03-15');
      
      const lunarDate = lunarCalendar.solarToLunar(solarDate);
      
      expect(lunarDate.year).toBe(1990);
      expect(lunarDate.month).toBeGreaterThan(0);
      expect(lunarDate.month).toBeLessThanOrEqual(12);
      expect(lunarDate.day).toBeGreaterThan(0);
      expect(lunarDate.day).toBeLessThanOrEqual(30);
    });

    it('should handle leap months correctly', () => {
      const lunarCalendar = new LunarCalendarService();
      const leapYearDate = new Date('2020-04-23'); // Known leap month year
      
      const lunarDate = lunarCalendar.solarToLunar(leapYearDate);
      
      expect(lunarDate).toHaveProperty('isLeapMonth');
      expect(typeof lunarDate.isLeapMonth).toBe('boolean');
    });

    it('should calculate traditional hour correctly', () => {
      const lunarCalendar = new LunarCalendarService();
      
      const traditionalHours = [
        { hour: 0, expected: 'tý' },
        { hour: 1, expected: 'sửu' },
        { hour: 7, expected: 'thìn' },
        { hour: 14, expected: 'mùi' },
        { hour: 23, expected: 'hợi' }
      ];

      traditionalHours.forEach(({ hour, expected }) => {
        const result = lunarCalendar.getTraditionalHour(hour);
        expect(result).toBe(expected);
      });
    });

    it('should generate can chi correctly', () => {
      const lunarCalendar = new LunarCalendarService();
      const year = 1990;
      
      const canChi = lunarCalendar.calculateCanChi(year);
      
      expect(canChi).toHaveProperty('can');
      expect(canChi).toHaveProperty('chi');
      expect(canChi.can).toMatch(/^(giáp|ất|bính|đinh|mậu|kỷ|canh|tân|nhâm|quý)$/);
      expect(canChi.chi).toMatch(/^(tý|sửu|dần|mão|thìn|tỵ|ngọ|mùi|thân|dậu|tuất|hợi)$/);
    });
  });

  describe('Chart Generation Service', () => {
    let chartService: ChartGenerationService;

    beforeEach(() => {
      chartService = new ChartGenerationService();
    });

    it('should generate complete Vietnamese astrology chart', async () => {
      const birthData = global.generateVietnameseBirthData();
      
      const chart = await chartService.generateChart(birthData);
      
      expect(chart.houses).toHaveLength(12);
      expect(chart.lunarDate).toBeDefined();
      expect(chart.canChi).toBeDefined();
      
      chart.houses.forEach((house, index) => {
        expect(house.index).toBe(index + 1);
        expect(house.name).toContain('Cung');
        expect(house).toHaveProperty('mainStars');
        expect(house).toHaveProperty('supportStars');
        expect(house).toHaveProperty('element');
      });
    });

    it('should handle different Vietnamese genders correctly', async () => {
      const maleBirthData = { ...global.generateVietnameseBirthData(), gender: 'nam' };
      const femaleBirthData = { ...global.generateVietnameseBirthData(), gender: 'nữ' };
      
      const maleChart = await chartService.generateChart(maleBirthData);
      const femaleChart = await chartService.generateChart(femaleBirthData);
      
      expect(maleChart).toBeDefined();
      expect(femaleChart).toBeDefined();
      // Charts should potentially differ based on gender
      expect(maleChart.gender).toBe('nam');
      expect(femaleChart.gender).toBe('nữ');
    });

    it('should place stars in correct houses based on birth time', async () => {
      const birthData = global.generateVietnameseBirthData();
      
      const chart = await chartService.generateChart(birthData);
      
      // Check that important stars are placed
      const allStars = chart.houses.flatMap(house => [...house.mainStars, ...house.supportStars]);
      
      // Should contain major Vietnamese astrology stars
      const expectedStars = ['Tử Vi', 'Thiên Cơ', 'Thái Dương', 'Vũ Khúc', 'Thiên Phủ'];
      expectedStars.forEach(star => {
        expect(allStars.some(s => s.name === star)).toBe(true);
      });
    });

    it('should calculate element associations correctly', async () => {
      const birthData = global.generateVietnameseBirthData();
      
      const chart = await chartService.generateChart(birthData);
      
      const validElements = ['kim', 'mộc', 'thủy', 'hỏa', 'thổ'];
      chart.houses.forEach(house => {
        expect(validElements).toContain(house.element);
      });
    });
  });

  describe('Chart Model Integration', () => {
    beforeEach(async () => {
      await AstrologyChart.deleteMany({});
    });

    it('should save Vietnamese chart with validation', async () => {
      const chartData = global.generateVietnameseChart();
      
      const chart = new AstrologyChart(chartData);
      await chart.save();
      
      expect(chart._id).toBeDefined();
      expect(chart.birthData.gender).toMatch(/^(nam|nữ)$/);
      expect(chart.birthData.timeOfBirth.traditionalHour).toMatch(
        /^(tý|sửu|dần|mão|thìn|tỵ|ngọ|mùi|thân|dậu|tuất|hợi)$/
      );
    });

    it('should validate Vietnamese birth data fields', async () => {
      const invalidChart = {
        userId: 'test-user',
        birthData: {
          name: 'Test',
          gender: 'invalid', // Should be 'nam' or 'nữ'
          solarDate: new Date(),
          timeOfBirth: {
            hour: 14,
            minute: 30,
            traditionalHour: 'invalid' // Should be valid Vietnamese hour
          }
        },
        chartData: {
          houses: [],
          lunarDate: { year: 2023, month: 1, day: 1, isLeapMonth: false }
        }
      };

      const chart = new AstrologyChart(invalidChart);
      
      await expect(chart.save()).rejects.toThrow();
    });

    it('should index charts by Vietnamese-specific fields', async () => {
      const chart = new AstrologyChart(global.generateVietnameseChart());
      await chart.save();
      
      // Test indexing by province
      const foundByProvince = await AstrologyChart.findOne({
        'birthData.placeOfBirth.province': 'Hà Nội'
      });
      
      expect(foundByProvince).toBeTruthy();
      expect(foundByProvince?.birthData.placeOfBirth.province).toBe('Hà Nội');
    });
  });
});