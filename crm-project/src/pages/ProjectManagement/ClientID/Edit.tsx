import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import {
  useEditClientDetailMutation,
  useGetClientDetailQuery,
} from "../../../service/project";
import { ClientDetail } from "../../../types/project";
import ComponentCard from "../../../components/common/ComponentCard";
import PhoneInput from "../../../components/form/group-input/PhoneInput";
import FileInput from "../../../components/form/input/FileInput";
import Input from "../../../components/form/input/InputField";
import InputSelect from "../../../components/form/InputSelect";
import Label from "../../../components/form/Label";
import Button from "../../../components/ui/button/Button";
import {
  getAllCountries,
  getUniquePhoneCodes,
  getStatesByCountryName,
  getCitiesByStateName,
  getCountryDataByIso,
  LocationOption,
} from "../../../utils/location";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import { toggleEditing } from "../../../features/project";
import Alert from "../../../components/ui/alert/Alert";
import Form from "../../../components/form/Form";

const ClientEdit = () => {
  const dispatch = useDispatch();
  const [id, setId] = useState<number | undefined>(1);

  const { clientdetail, isEditing } = useSelector( (state: RootState) => state.project );

  useEffect(() => {
    if (clientdetail?.name) {
      setId(clientdetail.id);
    }
  }, [clientdetail, id]);

  const { data: clientData, isLoading: isFetching } = useGetClientDetailQuery(id, { skip: !id });

  const [editClient, { isLoading: isSaving }] = useEditClientDetailMutation();

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

  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string; } | null>(null);

  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    if (clientData) {
      setFormData({
        name: clientData.name,
        email: clientData.email,
        phone_code: clientData.phone_code,
        phone: clientData.phone,
        address: clientData.address || {
          address: "",
          city: "",
          state: "",
          postal_code: 0,
          country: "",
        },
      });
    }
  }, [clientData]);

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
    if (errors[name])
      setErrors((prev: any) => ({ ...prev, [name]: undefined }));
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
        address: { ...prev.address, [name]: undefined },
      }));
    }
  };

  const handlePostalCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      address: { ...prev.address!, postal_code: Number(e.target.value) },
    }));
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
    setStatusMessage(null);
    setErrors({});

    if (!id) return;

    try {
      const payload = { ...formData };
      await editClient({ id, body: payload }).unwrap();
      setStatusMessage({
        type: "success",
        text: "Client updated successfully!",
      });
      dispatch(toggleEditing());
    } catch (error: any) {
      const globalMsg = 
        error?.data?.detail || 
        error?.data?.non_field_errors?.[0] || 
        "Failed to upadate client.";
      setStatusMessage({ type: "error", text: globalMsg });
      setErrors(error.data);
    }
  };

  if (isFetching) {
    return <div className="p-4 text-center">Loading client details...</div>;
  }

  return (
    <ComponentCard
      title="Edit Client Details"
      desc={`${formData.name}`}
      isEditing={true}
      onEdit={() => dispatch(toggleEditing())}
    >
      {statusMessage && (<div className="mb-4">
        <Alert variant={statusMessage.type} title={`${clientdetail?.name}`} message={statusMessage.text} />
      </div> )}

      <Form className="space-y-6 p-5" onSubmit={handleSubmit}>
        {/* Name */}
        <div className="mb-4">
          <Label htmlFor="name">Company Name</Label>
          <Input
            type="text"
            id="name"
            name="name"
            value={formData.name || ""}
            onChange={handleInputChange}
            error={!!errors.name}
            disabled={!isEditing}
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
            value={formData.email || ""}
            onChange={handleInputChange}
            error={!!errors.email}
            disabled={!isEditing}
            hint={errors.email}
          />
          
        </div>

        {/* Phone */}
        <div className="mb-4">
          <Label>Company Phone</Label>
          <PhoneInput
            countries={getCountryPhoneCodes}
            defaultCode={formData.phone_code || ""}
            defaultNumber={formData.phone || ""}
            onChange={handlePhoneChange}
            disabled={!isEditing}
            error={!!errors.phone}
            hint={errors.phone}
          />
        </div>

        {/* Profile Image - Note: Updating files via JSON won't work easily */}
      
          <div className="inline-flex gap-3 w-full mb-4 ">
            <img
              src={`/images/user/user-03.jpg`}
              alt={`${formData.id} logo`}
              className="w-20 h-20 rounded"
            />
            <div className="flex-1">
              <Label>Update Company Profile</Label>
              <FileInput
                onChange={handleFileChange}
                className=""
                name="profile"
                disabled={!isEditing}
              />
              <span className="text-xs text-gray-500">
                Leave empty to keep current image
              </span>
            </div>
          </div>

        {/* Address Line */}
        <div className="mb-4">
          <Label htmlFor="address">Company Address</Label>
          <Input
            type="text"
            id="address"
            name="address"
            disabled={!isEditing}
            value={formData.address?.address || ""}
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
              disabled={!isEditing}
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
              disabled={!isEditing}
              hint={errors?.address?.state}
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
              disabled={!isEditing}
              hint={errors?.address?.city}
            />
            
          </div>
          <div>
            <Label htmlFor="postal_code">Post Code</Label>
            <Input
              type="number"
              id="postal_code"
              name="postal_code"
              value={formData.address?.postal_code || 0}
              onChange={handlePostalCodeChange}
              error={!!errors.address?.postal_code}
              disabled={!isEditing}
              hint={errors?.address?.postal_code}
            />
            
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button disabled={!isEditing}>
            {isSaving ? "Saving..." : "Edit Changes"}
          </Button>
        </div>
      </Form>
    </ComponentCard>
  );
};

export default ClientEdit;
