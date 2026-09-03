export const ALL_STATES = ['Maharashtra', 'Gujarat', 'Karnataka', 'Delhi'];

export interface VillageLocation {
  name: string;
}

export interface CityLocation {
  name: string;
  villages: string[];
}

export interface DistrictLocation {
  name: string;
  cities: CityLocation[];
}

export interface StateLocations {
  state: string;
  districts: DistrictLocation[];
}

export const MAHARASHTRA_LOCATIONS: StateLocations = {
  state: 'Maharashtra',
  districts: [
    {
      name: 'Pune',
      cities: [
        { 
          name: 'Pimpri-Chinchwad', 
          villages: ['Akurdi', 'Nigdi', 'Ravet', 'Wakad', 'Hinjewadi', 'Bhosari'] 
        },
        { 
          name: 'Pune City', 
          villages: ['Kothrud', 'Viman Nagar', 'Baner', 'Kharadi', 'Kalyani Nagar'] 
        },
      ],
    },
    {
      name: 'Mumbai',
      cities: [
        { name: 'Mumbai Suburban', villages: ['Andheri', 'Bandra', 'Borivali', 'Goregaon'] },
        { name: 'Mumbai City', villages: ['Colaba', 'Dadar', 'Worli', 'Malabar Hill'] },
      ],
    },
    {
      name: 'Bhandara',
      cities: [
        { name: 'Bhandara City', villages: ['Rajiv Gandhi Chowk', 'Khat Road', 'Tumsar Road', 'Pauni'] },
      ],
    },
  ],
};
