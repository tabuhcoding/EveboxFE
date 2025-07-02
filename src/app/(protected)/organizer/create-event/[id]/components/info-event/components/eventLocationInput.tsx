/* Package System */
import React, { useState, useEffect, ChangeEvent } from "react";
import { useTranslations } from 'next-intl';

/* Package Application */
import InputField from '../../common/form/inputCountField';
import SelectField from '../../common/form/selectField';
import { EventLocationInputProps } from '../../../libs/interface/infoevent.interface';

export default function EventLocationInput({
  eventTypeSelected,
  eventAddress,
  province,
  district,
  ward,
  street,
  errors,
  provinces,
  districts,
  createdLocations,
  // wards, 
  handleInputChange,
  handleSelectChange,
  setEventTypeSelected,
  updateGenerationForm,
}: EventLocationInputProps) {
  const t = useTranslations('common');

  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    if (!msg || msg.startsWith('common.')) return fallback;
    return msg;
  };

  const [selectedLocation, setSelectedLocation] = useState("");
  console.log("all district:--------", districts)

  const setFormField = (field: string, value: string) => {
    if (["eventAddress", "ward", "street"].includes(field)) {
      handleInputChange({ target: { value } } as React.ChangeEvent<HTMLInputElement>, field);
    } else {
      handleSelectChange({ target: { value } } as React.ChangeEvent<HTMLSelectElement>, field);
    }
  };

  const [hasAutoFilled, setHasAutoFilled] = useState(false);

  useEffect(() => {
    if (!selectedLocation || !createdLocations?.length || hasAutoFilled) return;

    const location = createdLocations.find(loc => loc.name === selectedLocation);
    if (location) {
      setFormField("eventAddress", location.eventAddress);
      setFormField("province", location.province);
      setFormField("district", location.districtName);
      setFormField("ward", location.ward);
      setFormField("street", location.street);
      setHasAutoFilled(true);
    }
  }, [selectedLocation, createdLocations, hasAutoFilled]);

  const clearSelection = () => {
    setSelectedLocation("");
    // Optionally clear fields
    setFormField("eventAddress", "");
    setFormField("province", "");
    setFormField("district", "");
    setFormField("ward", "");
    setFormField("street", "");
  };

  return (
    <div className="mt-3 p-6 lg:p-8 rounded-lg shadow-sm w-full max-w-5xl mx-auto" style={{ backgroundColor: "rgba(158, 245, 207, 0.2)", border: "1.5px solid #9EF5CF" }}>
      <p className="block text-sm font-bold mb-2">
        <span className="text-red-500">* </span> {transWithFallback('locationAddress', 'Địa điểm sự kiện')}
      </p>

      {/* Radio buttons */}
      <div className="flex items-center gap-6 mt-2 text-sm mb-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="event_location"
            className="peer hidden"
            checked={eventTypeSelected === "offline"}
            onChange={() => {
              setEventTypeSelected("offline")
              updateGenerationForm("isOnlineEvent", eventTypeSelected === "offline" ? false : true);
            }}
          />
          <div className="w-4 h-4 rounded-full border border-black bg-white flex items-center justify-center peer-checked:bg-[#9EF5CF] peer-focus:border-green-700">
            <div className="w-2 h-2 rounded-full bg-white"></div>
          </div>
          <span>{transWithFallback('eventTypeOffline', 'Sự kiện offline')}</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="event_location"
            className="peer hidden"
            checked={eventTypeSelected === "online"}
            onChange={() => {
              setEventTypeSelected("online")
              updateGenerationForm("isOnlineEvent", eventTypeSelected === "online" ? true : false);
            }}
          />
          <div className="w-4 h-4 rounded-full border border-black bg-white flex items-center justify-center peer-checked:bg-[#9EF5CF]">
            <div className="w-2 h-2 rounded-full bg-white"></div>
          </div>
          <span>{transWithFallback('eventTypeOnline', 'Sự kiện online')}</span>
        </label>
      </div>

      {/* Chỉ hiển thị phần nhập địa chỉ khi chọn "Sự kiện offline" */}
      {eventTypeSelected === "offline" && (
        <div>
          {/* Địa điểm đã tạo */}
          <div className="location-created flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <SelectField
                label={transWithFallback('createdLocation', 'Địa điểm đã từng tạo sự kiện')}
                options={createdLocations.map(loc => loc.name)}
                value={selectedLocation}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                  setHasAutoFilled(false);
                  setSelectedLocation(e.target.value);
                }}
              />
              {selectedLocation && (
                <button
                  type="button"
                  onClick={clearSelection}
                  className="clear-address-btn inline-flex items-center justify-center mt-2 px-3 py-1 text-xs font-medium bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition"
                >
                  {transWithFallback('clearSelectedLocation', 'Xóa địa điểm đã chọn')}
                </button>
              )}
            </div>
          </div>

          {/* Tên địa điểm */}
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <InputField
                label={transWithFallback('locationName', 'Tên địa điểm')}
                placeholder={transWithFallback('locationNamePlaceholder', 'Nhập tên địa điểm')}
                value={eventAddress}
                onChange={(e) => handleInputChange(e, "eventAddress")}
                error={errors.eventAddress}
                maxLength={80}
                required
              />
            </div>
          </div>

          {/* Tỉnh/Thành */}
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <SelectField
                label={transWithFallback('province', 'Tỉnh/Thành')}
                options={provinces}
                value={province}
                onChange={(e) => handleSelectChange(e, "province")}
                error={errors.province}
                required
              />
            </div>

            {/* Quận/Huyện */}
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <SelectField
                label={transWithFallback('district', 'Quận/Huyện')}
                options={districts}
                value={district}
                onChange={(e) => handleSelectChange(e, "district")}
                error={errors.district}
                required
              />
            </div>
          </div>

          {/* Phường/Xã */}
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <InputField
                label={transWithFallback('ward', 'Phường/Xã')}
                placeholder={transWithFallback('wardPlaceholder', 'Nhập phường/xã')}
                value={ward}
                onChange={(e) => handleInputChange(e, "ward")}
                error={errors.ward}
                maxLength={80}
                required
              />
            </div>

            {/* Số nhà, đường */}
            <div className="w-full md:w-1/2 px-3">
              <InputField
                label={transWithFallback('street', 'Số nhà, đường')}
                placeholder={transWithFallback('streetPlaceholder', 'Nhập số nhà, đường')}
                value={street}
                onChange={(e) => handleInputChange(e, "street")}
                error={errors.street}
                maxLength={80}
                required
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};