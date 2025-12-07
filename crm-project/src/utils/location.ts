import { Country, State, City } from "country-state-city";

export interface LocationOption {
  value: string;
  label: string;
}

export interface PhoneCodeOption {
  value: string;
  code: string;
  label: string;
  flag: string;
}

// Get all countries formatted for dropdowns
export const getAllCountries = (): LocationOption[] => {
  return Country.getAllCountries().map((country) => ({
    value: country.isoCode,
    label: country.name,
  }));
};

// Get unique phone codes (deduplicated)
export const getUniquePhoneCodes = (): PhoneCodeOption[] => {
  const allCountries = Country.getAllCountries();
  const seenCodes = new Set();
  const uniqueList: PhoneCodeOption[] = [];

  for (const country of allCountries) {
    if (!seenCodes.has(country.phonecode)) {
      seenCodes.add(country.phonecode);
      uniqueList.push({
        value: country.isoCode,
        code: country.phonecode,
        label: country.phonecode,
        flag: country.flag,
      });
    }
  }
  return uniqueList;
};

// Get states based on the Country Name (reverse lookup ISO first)
export const getStatesByCountryName = (countryName: string): LocationOption[] => {
  if (!countryName) return [];

  // Find country ISO by name
  const allCountries = Country.getAllCountries();
  const country = allCountries.find((c) => c.name === countryName);

  if (!country) return [];

  return State.getStatesOfCountry(country.isoCode).map((state) => ({
    value: state.isoCode,
    label: state.name,
  }));
};

// Get cities based on Country Name and State Name
export const getCitiesByStateName = (countryName: string, stateName: string): LocationOption[] => {
  if (!countryName || !stateName) return [];

  const allCountries = Country.getAllCountries();
  const country = allCountries.find((c) => c.name === countryName);
  if (!country) return [];

  const allStates = State.getStatesOfCountry(country.isoCode);
  const state = allStates.find((s) => s.name === stateName);
  if (!state) return [];

  return City.getCitiesOfState(country.isoCode, state.isoCode).map((city) => ({
    value: city.name,
    label: city.name,
  }));
};

// Helper to get raw country data (for phone code lookup)
export const getCountryDataByIso = (isoCode: string) => {
  return Country.getCountryByCode(isoCode);
};