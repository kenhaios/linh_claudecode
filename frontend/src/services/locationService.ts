// Vietnamese Location Service for Ha Linh Astrology Platform
import axios from 'axios';

// Vietnamese provinces and cities data
interface VietnameseProvince {
  code: number;
  name: string;
  codename: string;
  division_type: string;
  phone_code: number;
}

interface VietnameseDistrict {
  code: number;
  name: string;
  codename: string;
  division_type: string;
  short_codename: string;
  province_code: number;
}

interface VietnameseWard {
  code: number;
  name: string;
  codename: string;
  division_type: string;
  short_codename: string;
  district_code: number;
}

// API base URL for Vietnamese administrative divisions
const PROVINCES_API_BASE = 'https://provinces.open-api.vn/api';

/**
 * Get all Vietnamese provinces and cities
 */
export const getVietnameseProvinces = async (): Promise<Array<{ code: number; name: string }>> => {
  try {
    const response = await axios.get<VietnameseProvince[]>(`${PROVINCES_API_BASE}/p`, {
      timeout: 10000,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    return response.data.map(province => ({
      code: province.code,
      name: province.name
    })).sort((a, b) => a.name.localeCompare(b.name, 'vi'));
  } catch (error) {
    console.error('Failed to fetch Vietnamese provinces:', error);
    
    // Fallback data for major Vietnamese provinces/cities
    return [
      { code: 1, name: 'Hà Nội' },
      { code: 79, name: 'Thành phố Hồ Chí Minh' },
      { code: 48, name: 'Đà Nẵng' },
      { code: 92, name: 'Cần Thơ' },
      { code: 36, name: 'Hải Phòng' },
      { code: 2, name: 'Hà Giang' },
      { code: 4, name: 'Cao Bằng' },
      { code: 6, name: 'Bắc Kạn' },
      { code: 8, name: 'Tuyên Quang' },
      { code: 10, name: 'Lào Cai' },
      { code: 11, name: 'Điện Biên' },
      { code: 12, name: 'Lai Châu' },
      { code: 14, name: 'Sơn La' },
      { code: 15, name: 'Yên Bái' },
      { code: 17, name: 'Hoà Bình' },
      { code: 19, name: 'Thái Nguyên' },
      { code: 20, name: 'Lạng Sơn' },
      { code: 22, name: 'Quảng Ninh' },
      { code: 24, name: 'Bắc Giang' },
      { code: 25, name: 'Phú Thọ' }
    ].sort((a, b) => a.name.localeCompare(b.name, 'vi'));
  }
};

/**
 * Get districts/counties for a specific Vietnamese province
 */
export const getVietnameseDistricts = async (provinceCode: number): Promise<Array<{ code: number; name: string }>> => {
  try {
    const response = await axios.get<{
      districts: VietnameseDistrict[];
    }>(`${PROVINCES_API_BASE}/p/${provinceCode}?depth=2`, {
      timeout: 10000,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    return response.data.districts.map(district => ({
      code: district.code,
      name: district.name
    })).sort((a, b) => a.name.localeCompare(b.name, 'vi'));
  } catch (error) {
    console.error(`Failed to fetch districts for province ${provinceCode}:`, error);
    
    // Fallback data for Hanoi districts (code: 1)
    if (provinceCode === 1) {
      return [
        { code: 1, name: 'Ba Đình' },
        { code: 2, name: 'Hoàn Kiếm' },
        { code: 3, name: 'Hai Bà Trưng' },
        { code: 4, name: 'Đống Đa' },
        { code: 5, name: 'Tây Hồ' },
        { code: 6, name: 'Cầu Giấy' },
        { code: 7, name: 'Thanh Xuân' },
        { code: 8, name: 'Long Biên' },
        { code: 9, name: 'Nam Từ Liêm' },
        { code: 10, name: 'Bắc Từ Liêm' },
        { code: 11, name: 'Hoàng Mai' },
        { code: 12, name: 'Hà Đông' }
      ];
    }
    
    // Fallback data for Ho Chi Minh City districts (code: 79)
    if (provinceCode === 79) {
      return [
        { code: 760, name: 'Quận 1' },
        { code: 761, name: 'Quận 2' },
        { code: 762, name: 'Quận 3' },
        { code: 763, name: 'Quận 4' },
        { code: 764, name: 'Quận 5' },
        { code: 765, name: 'Quận 6' },
        { code: 766, name: 'Quận 7' },
        { code: 767, name: 'Quận 8' },
        { code: 768, name: 'Quận 9' },
        { code: 769, name: 'Quận 10' },
        { code: 770, name: 'Quận 11' },
        { code: 771, name: 'Quận 12' },
        { code: 772, name: 'Thủ Đức' },
        { code: 773, name: 'Gò Vấp' },
        { code: 774, name: 'Bình Thạnh' },
        { code: 775, name: 'Tân Bình' },
        { code: 776, name: 'Tân Phú' },
        { code: 777, name: 'Phú Nhuận' }
      ];
    }
    
    return [];
  }
};

/**
 * Get wards for a specific Vietnamese district
 */
export const getVietnameseWards = async (districtCode: number): Promise<Array<{ code: number; name: string }>> => {
  try {
    const response = await axios.get<{
      wards: VietnameseWard[];
    }>(`${PROVINCES_API_BASE}/d/${districtCode}?depth=2`, {
      timeout: 10000,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    return response.data.wards.map(ward => ({
      code: ward.code,
      name: ward.name
    })).sort((a, b) => a.name.localeCompare(b.name, 'vi'));
  } catch (error) {
    console.error(`Failed to fetch wards for district ${districtCode}:`, error);
    return [];
  }
};

/**
 * Search Vietnamese locations by name
 */
export const searchVietnameseLocations = async (query: string): Promise<{
  provinces: Array<{ code: number; name: string; type: 'province' }>;
  districts: Array<{ code: number; name: string; province: string; type: 'district' }>;
}> => {
  try {
    const [provinces, allProvinces] = await Promise.all([
      getVietnameseProvinces(),
      getVietnameseProvinces()
    ]);

    const normalizedQuery = query.toLowerCase().trim();
    
    // Search provinces
    const matchingProvinces = provinces
      .filter(province => 
        province.name.toLowerCase().includes(normalizedQuery)
      )
      .map(province => ({ ...province, type: 'province' as const }));

    // Search districts (limited to first 10 provinces for performance)
    const districtPromises = allProvinces.slice(0, 10).map(async (province) => {
      try {
        const districts = await getVietnameseDistricts(province.code);
        return districts
          .filter(district => 
            district.name.toLowerCase().includes(normalizedQuery)
          )
          .map(district => ({
            ...district,
            province: province.name,
            type: 'district' as const
          }));
      } catch {
        return [];
      }
    });

    const districtResults = await Promise.all(districtPromises);
    const matchingDistricts = districtResults.flat();

    return {
      provinces: matchingProvinces,
      districts: matchingDistricts
    };
  } catch (error) {
    console.error('Failed to search Vietnamese locations:', error);
    return { provinces: [], districts: [] };
  }
};

/**
 * Get full address information for Vietnamese location
 */
export const getVietnameseLocationInfo = async (
  provinceCode?: number,
  districtCode?: number,
  wardCode?: number
): Promise<{
  province?: { code: number; name: string };
  district?: { code: number; name: string };
  ward?: { code: number; name: string };
  fullAddress: string;
}> => {
  try {
    const result: any = { fullAddress: '' };
    const addressParts: string[] = [];

    // Get province info
    if (provinceCode) {
      const provinces = await getVietnameseProvinces();
      const province = provinces.find(p => p.code === provinceCode);
      if (province) {
        result.province = province;
        addressParts.push(province.name);
      }
    }

    // Get district info
    if (districtCode && provinceCode) {
      const districts = await getVietnameseDistricts(provinceCode);
      const district = districts.find(d => d.code === districtCode);
      if (district) {
        result.district = district;
        addressParts.unshift(district.name);
      }
    }

    // Get ward info
    if (wardCode && districtCode) {
      const wards = await getVietnameseWards(districtCode);
      const ward = wards.find(w => w.code === wardCode);
      if (ward) {
        result.ward = ward;
        addressParts.unshift(ward.name);
      }
    }

    result.fullAddress = addressParts.join(', ');
    return result;
  } catch (error) {
    console.error('Failed to get Vietnamese location info:', error);
    return { fullAddress: '' };
  }
};

/**
 * Get coordinates for Vietnamese location (approximate)
 */
export const getVietnameseLocationCoordinates = (provinceCode: number): { 
  latitude: number; 
  longitude: number; 
} | null => {
  // Approximate coordinates for major Vietnamese cities/provinces
  const coordinates: Record<number, { latitude: number; longitude: number }> = {
    1: { latitude: 21.0285, longitude: 105.8542 }, // Hà Nội
    79: { latitude: 10.8231, longitude: 106.6297 }, // TP.HCM
    48: { latitude: 16.0471, longitude: 108.2068 }, // Đà Nẵng
    92: { latitude: 10.0452, longitude: 105.7469 }, // Cần Thơ
    36: { latitude: 20.8449, longitude: 106.6881 }, // Hải Phòng
    26: { latitude: 18.3351, longitude: 105.9024 }, // Nghệ An
    38: { latitude: 17.4739, longitude: 106.6236 }, // Quảng Bình
    42: { latitude: 15.8801, longitude: 108.338 }, // Quảng Nam
    46: { latitude: 12.2585, longitude: 109.0526 }, // Khánh Hòa
    58: { latitude: 10.9769, longitude: 108.0717 }, // Đồng Nai
    77: { latitude: 11.3254, longitude: 106.4369 }, // Tây Ninh
    89: { latitude: 9.1668, longitude: 105.1445 }, // An Giang
  };

  return coordinates[provinceCode] || null;
};

/**
 * Check if location is in Vietnam
 */
export const isVietnameseLocation = (provinceCode: number): boolean => {
  // Vietnam province codes range from 1 to 96
  return provinceCode >= 1 && provinceCode <= 96;
};

/**
 * Get Vietnamese region for province
 */
export const getVietnameseRegion = (provinceCode: number): string => {
  if (provinceCode >= 1 && provinceCode <= 26) {
    return 'Miền Bắc'; // Northern Vietnam
  } else if (provinceCode >= 27 && provinceCode <= 48) {
    return 'Miền Trung'; // Central Vietnam
  } else if (provinceCode >= 49 && provinceCode <= 96) {
    return 'Miền Nam'; // Southern Vietnam
  }
  
  return 'Không xác định';
};