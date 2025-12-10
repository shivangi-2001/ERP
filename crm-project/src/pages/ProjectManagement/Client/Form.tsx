import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useCreateClientDetailMutation } from "../../../service/project";
import { ClientDetail } from "../../../types/project";
import ComponentCard from "../../../components/common/ComponentCard";
import PhoneInput from "../../../components/form/group-input/PhoneInput";
import FileInput from "../../../components/form/input/FileInput";
import Input from "../../../components/form/input/InputField";
import InputSelect from "../../../components/form/InputSelect";
import Label from "../../../components/form/Label";
import Button from "../../../components/ui/button/Button";
import { getAllCountries, getUniquePhoneCodes, getStatesByCountryName, getCitiesByStateName, getCountryDataByIso, LocationOption } from "../../../utils/location"; 

const ClientForm = () => {
  const navigate = useNavigate();
  const [createClientDetail, { isLoading }] = useCreateClientDetailMutation();
  const [profileFile, setProfileFile] = useState<File | null>(null);

  const [formData, setFormData] = useState<Partial<ClientDetail>>({
    name: "",
    email: "",
    phone_code: "",
    phone: "",
    address: {
      address: "",
      city: "",
      state: "",
      postal_code: 0,
      country: "",
    },
  });

  const [errors, setErrors] = useState<any>({});

  const countries = useMemo(() => getAllCountries(), []);

  const getCountryPhoneCodes = useMemo(() => getUniquePhoneCodes(), []);

  const states = useMemo(() => {
    return getStatesByCountryName(formData.address?.country || "");
  }, [formData.address?.country]);

  const cities = useMemo(() => {
    return getCitiesByStateName(
      formData.address?.country || "", 
      formData.address?.state || ""
    );
  }, [formData.address?.country, formData.address?.state]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
        setErrors((prev: any) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      address: { ...prev.address!, [name]: value },
    }));

    if (errors.address?.[name]) {
        setErrors((prev: any) => ({
            ...prev,
            address: { ...prev.address, [name]: undefined }
        }));
    }
  };

  const handlePostalCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      address: { ...prev.address!, postal_code: Number(e.target.value) },
    }));
    
    if (errors.address?.postal_code) {
        setErrors((prev: any) => ({
            ...prev,
            address: { ...prev.address, postal_code: undefined }
        }));
    }
  };

  const handleCountrySelect = (option: LocationOption) => {
    const countryData = getCountryDataByIso(option.value);

    setFormData((prev) => ({
      ...prev,
      phone_code: countryData ? countryData.phonecode : prev.phone_code,
      address: {
        ...prev.address!,
        country: option.label,
        state: "", 
        city: "",  
      },
    }));
  };

  const handleStateSelect = (option: LocationOption) => {
    setFormData((prev) => ({
      ...prev,
      address: { ...prev.address!, state: option.label, city: "" },
    }));
  };

  const handleCitySelect = (option: LocationOption) => {
    setFormData((prev) => ({
      ...prev,
      address: { ...prev.address!, city: option.label },
    }));
  };

  const handlePhoneChange = ({ code, number, }: { code: string; number: string; }) => {
    setFormData((prev) => ({
      ...prev,
      phone_code: code,
      phone: number,
    }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setProfileFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({}); 
    
    try {
      console.log("Submitting:", formData);
      const payload: Partial<ClientDetail> = { ...formData };
      await createClientDetail(payload).unwrap();
      console.log("Client Created Successfully");
      navigate("/on-board");
    } catch (error: any) {
      const globalMsg = 
      error?.data?.detail || 
      error?.data?.non_field_errors?.[0] || 
      "Failed to upadate client.";
    // setStatusMessage({ type: "error", text: globalMsg });
    setErrors(error.data);
    }
  };

  return (
    <ComponentCard title="Add Client" desc="Add new client details">
      <form className="space-y-6 p-5" onSubmit={handleSubmit}>
        
        {/* Name */}
        <div className="mb-4">
          <Label htmlFor="name">Company Name</Label>
          <Input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            error={!!errors.name}
            hint={errors.name}
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <Label htmlFor="email">Company Email</Label>
          <Input
            type="email"
            id="email"
            placeholder="company_email@gmail.com"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            error={!!errors.email}
            hint={errors.email}
          />
        </div>

        {/* Phone */}
        <div className="mb-4">
          <Label>Company Phone</Label>
          <PhoneInput
            countries={getCountryPhoneCodes}
            defaultCode={formData.phone_code}
            defaultNumber={formData.phone}
            onChange={handlePhoneChange}
            error={!!errors.phone}
            hint={errors.phone}
          />
        </div>

        {/* Profile */}
        <div className="my-4">
          <Label>Upload Company Profile (optional)</Label>
          <FileInput 
            onChange={handleFileChange} 
            className="" 
            name="profile" 
          />
        </div>

        {/* Address Line */}
        <div className="mb-4">
          <Label htmlFor="address">Company Address</Label>
          <Input
            type="text"
            id="address"
            name="address"
            value={formData.address?.address}
            onChange={handleAddressChange}
            error={!!errors.address?.address}
            hint={errors.address?.address}
          />
        </div>

        {/* Country & State */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <Label htmlFor="country">Country</Label>
            <InputSelect
              options={countries}
              placeholder="Search for a country..."
              onSelect={handleCountrySelect}
              defaultValue={formData.address?.country}
              name="country"
              error={!!errors.address?.country}
              hint={errors.address?.country}
            />
          </div>
          <div>
            <Label htmlFor="state">State</Label>
            <InputSelect
              options={states}
              placeholder="Search for a state..."
              onSelect={handleStateSelect}
              defaultValue={formData.address?.state}
              name="state"
              error={!!errors.address?.state}
              hint={errors.address?.state}
            />
          </div>
        </div>

        {/* City & Zip */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <Label htmlFor="city">City</Label>
            <InputSelect
              options={cities}
              placeholder="Search for a city..."
              onSelect={handleCitySelect}
              defaultValue={formData.address?.city}
              name="city"
              error={!!errors.address?.city}
              hint={errors.address?.city}
            />
          </div>
          <div>
            <Label htmlFor="postal_code">Post Code</Label>
            <Input
              type="number"
              id="postal_code"
              name="postal_code"
              value={formData.address?.postal_code}
              onChange={handlePostalCodeChange}
              error={!!errors.address?.postal_code}
              hint={errors.address?.postal_code}
            />
          </div>
        </div>


        <div className="flex justify-end gap-2">
          <Button disabled={isLoading}>
            {isLoading ? "Saving..." : "Add Client"}
          </Button>
        </div>
      </form>
    </ComponentCard>
  );
};

export default ClientForm;