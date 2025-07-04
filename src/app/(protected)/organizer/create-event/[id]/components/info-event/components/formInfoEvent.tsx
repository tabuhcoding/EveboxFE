"use client";

/* Package System */
import { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { useTranslations, useLocale } from 'next-intl';

/* Package Application */
import SelectField from "../../common/form/selectField";
import TextEditor from "./textEditor";
import OrganizationInfoForm from "./organizationInfoForm";
import EventLocationInput from "./eventLocationInput";
import EventImageUpload from "./eventImageUpload";
import { getAllCategories, getAllDistricts, getEventDetail, updateEvent } from "services/event.service";
import { Province } from "types/models/event/location.interface";
import { CreateEventDto, EventDescriptionGenDto } from "types/models/event/createEvent.dto";
import { useEventImageUpload } from "../../../libs/hooks/useEventImageUpload";
import { Category } from "@/types/models/dashboard/frontDisplay";

interface FormInformationEventClientProps {
  onNextStep: (payload: CreateEventDto) => void;
  btnValidate: string;
}

export default function FormInformationEventClient({ onNextStep, btnValidate }: FormInformationEventClientProps) {
  const router = useRouter();
  const params = useParams();
  const currentEventId = params?.id;
  const t = useTranslations('common');
  const locale = useLocale();

  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    if (!msg || msg.startsWith('common.')) return fallback;
    return msg;
  };

  const [background, setBackground] = useState<string | null>(null);
  const [logoOrg, setLogoOrg] = useState<string | null>(null);

  const [eventName, setEventName] = useState("");
  const [nameOrg, setNameOrg] = useState("");
  const [infoOrg, setInfoOrg] = useState("");
  const [eventTypeSelected, setEventTypeSelected] = useState("offline");
  const [eventAddress, setEventAddress] = useState("");
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [street, setStreet] = useState("");
  const [eventDetailInfo, setEventDetailInfo] = useState<EventDescriptionGenDto | null>(null);

  //********Call api**********
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [allProvinces, setAllProvinces] = useState<Province[]>([]);

  // const [generationForm, setGenerationForm] = useState<GenerationProps>({
  //   name: "",
  //   description: "",
  //   isOnlineEvent: eventTypeSelected === "offline" ? false : true,
  //   location: "",
  //   venue: "",
  //   organizer: "",
  //   organizerDescription: "",
  //   categoryIds: [],
  // });

  //Gán cứng địa điểm đã tạo
  const createdLocations = [
    {
      name: "Nhà hát Ánh Trăng",
      eventAddress: "Nhà hát Ánh Trăng",
      province: "Ho Chi Minh City",
      districtName: "1 District",
      ward: "Phường 6",
      street: "123 Phổ Quang",
    },
    {
      name: "Nhà văn hóa Thanh Niên",
      eventAddress: "Nhà văn hóa Thanh Niên",
      province: "Ho Chi Minh City",
      districtName: "Binh Thanh District",
      ward: "Phường Bến Nghé",
      street: "4 Phạm Ngọc Thạch",
    },
  ];

  //Nội dung sẵn trong Thông tin sự kiện
  const [post, setPost] = useState('');

  useEffect(() => {
    const defaultPost = `
      <p><strong>${transWithFallback('eventIntro', 'Giới thiệu sự kiện')}:</strong></p>
      <p>
        ${transWithFallback(
      'eventIntroDesc',
      '[Tóm tắt ngắn gọn về sự kiện: Nội dung chính, điểm đặc sắc nhất và lý do khiến người tham gia không nên bỏ lỡ]'
    )}
      </p>

      <p><strong>${transWithFallback('eventDetail', 'Chi tiết sự kiện')}:</strong></p>
      <ul class="list-disc ml-5">
        <li>
          <span><strong>${transWithFallback('mainProgram', 'Chương trình chính')}:</strong></span>
          ${transWithFallback(
      'mainProgramDesc',
      '[Liệt kê những hoạt động nổi bật trong sự kiện: các phần trình diễn, khách mời đặc biệt, lịch trình các tiết mục cụ thể nếu có.]'
    )}
        </li>
        <li>
          <span><strong>${transWithFallback('guests', 'Khách mời')}:</strong></span>
          ${transWithFallback(
      'guestsDesc',
      '[Thông tin về các khách mời đặc biệt, nghệ sĩ, diễn giả sẽ tham gia sự kiện.]'
    )}
        </li>
        <li>
          <span><strong>${transWithFallback('targetAudience', 'Đối tượng hướng tới')}:</strong></span>
          ${transWithFallback(
      'audienceDesc',
      '[Chỉ rõ tệp đối tượng mà chương trình chủ yếu đáp ứng nhu cầu]'
    )}
        </li>
      </ul>

      <p><strong>${transWithFallback('term', 'Điều khoản và điều kiện')}:</strong></p>
      <p>${transWithFallback('tnc', '[TnC] sự kiện')}</p>
      <p>${transWithFallback('childrenNote', 'Lưu ý về điều khoản trẻ em')}</p>
      <p>${transWithFallback('vatNote', 'Lưu ý về điều khoản VAT')}</p>
    `;

    setPost(defaultPost);
  }, [locale, t]);

  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});
  const [imageErrors, setImageErrors] = useState<{ [key: string]: string }>({});
  const [imageLogoErrors, setImageLogoErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchEventTypes = async () => {
      try {
        const data = await getAllCategories();

        const eventTypes = data.map((item: Category) => ({
          id: item.id,
          name: item.name,
          createAt: item.createAt
        }));

        setCategories(eventTypes);
      } catch (error) {
        console.error("Error fetching event types:", error);
        toast.error(transWithFallback("errorLoadEvent", "Lỗi khi tải danh sách thể loại sự kiện!"), { duration: 5000 });
      }
    };

    fetchEventTypes();
  }, []);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const data = await getAllDistricts();

        const removeQuotes = (str: string) => str?.replace(/^"(.*)"$/, '$1').replace(/"/g, '');
        const cleanedData = data.map((province) => ({
          ...province,
          name: {
            ...province.name,
            vi: removeQuotes(province.name.vi),
          },
          districts: province.districts.map((district) => ({
            ...district,
            name: {
              ...district.name,
              vi: removeQuotes(district.name.vi),
            },
          })),
        }));

        setAllProvinces(cleanedData);
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    };

    fetchProvinces();
  }, []);


  useEffect(() => {
    if (currentEventId) {
      const fetchEventDetail = async () => {
        try {
          const res = await getEventDetail(parseInt(params?.id as string));
          const eventData = res.data;

          setEventName(eventData.title);
          setPost(eventData.description);
          setEventTypeSelected(eventData.isOnline ? "online" : "offline");
          setNameOrg(eventData.orgName);
          setInfoOrg(eventData.orgDescription);

          if (eventData.isOnline === false) {
            setEventAddress(eventData.venue);

            if (eventData) {
              const locationParts = eventData.locationsString?.split(",").map(part => part.trim());

              if (locationParts.length >= 4) {
                setStreet(locationParts[0]);
                setWard(locationParts[1]);
                setDistrict(locationParts[2]);
                setProvince(locationParts.slice(3).join(", ")); // In case province name has commas
              } else {
                // fallback if missing parts
                setStreet("");
                setWard("");
                setDistrict("");
                setProvince("");
              }
            }
          } else {
            setEventAddress("");
            setStreet("");
            setWard("");
            setDistrict("");
            setProvince("");
          }

          if (eventData.imgPosterUrl) {
            setBackground(eventData.imgPosterUrl);
          }

          if (eventData.imgLogoUrl) {
            setLogoOrg(eventData.imgLogoUrl);
          }

          if (eventData.categories && eventData.categories.length > 0) {
            const cat = eventData.categories[0];
            setSelectedCategory({ id: cat.id, name: cat.name, createAt: "" });
          }

          const locationParts = eventData.locationsString?.split(",").map(part => part.trim());

          // setGenerationForm({
          //   name: eventData.title || "",
          //   description: eventData.description || "",
          //   isOnlineEvent: eventData.isOnline,
          //   location: `${locationParts[0] || ''}, ${locationParts[1] || ''}, ${locationParts[2] || ''}, ${locationParts[3] || ''}`,
          //   venue: eventData.venue || "",
          //   organizer: eventData.orgName || "",
          //   organizerDescription: eventData.orgDescription || "",
          //   categoryIds: eventData.categories?.length ? eventData.categories.map((c: { id: number }) => c.id) : []
          // });

          setEventDetailInfo({
            name: eventData.title || "",
            isOnlineEvent: eventData.isOnline,
            location: `${locationParts[0] || ''}, ${locationParts[1] || ''}, ${locationParts[2] || ''}, ${locationParts[3] || ''}`,
            venue: eventData.venue || "",
            organizer: eventData.orgName || "",
            organizerDescription: eventData.orgDescription || "",
            categories: eventData.categories?.length ? eventData.categories.map((c: { id: number }) => String(c.id)) : []
          })

        } catch (error) {
          console.error("Error fetching event detail:", error);
          toast.error(transWithFallback('errorWhenFetchEventDetail', 'Lỗi khi tải thông tin sự kiện!'), { duration: 5000 });
        }
      };

      fetchEventDetail();
    }
  }, [currentEventId]);


  useEffect(() => {
    updateGenerationForm("isOnlineEvent", eventTypeSelected === "offline" ? false : true);
    // updateGenerationForm("description", post);
  }, []);

  const updateGenerationForm = (field: keyof EventDescriptionGenDto, value: string | number | boolean | number[]) => {
    setEventDetailInfo((prev) => {
      const safePrev: EventDescriptionGenDto = prev ?? {
        name: "",
        isOnlineEvent: false,
        location: "",
        venue: "",
        organizer: "",
        organizerDescription: "",
        categories: [],
      };
      return {
        ...safePrev,
        [field]: value,
      };
    });
  };
  const { uploadImage } = useEventImageUpload();


  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;


    try {
      const { imageUrl } = await uploadImage(file);
      setBackground(imageUrl);
    } catch {
      toast.error(transWithFallback('errorWhenUploadBackground', 'Tải ảnh nền thất bại'));
    }
  };


  const handleUploadLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const { imageUrl } = await uploadImage(file);
      setLogoOrg(imageUrl);
    } catch {
      toast.error(transWithFallback('errorWhenUploadLogo', 'Tải logo thất bại'));
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>, field: string) => {
    const value = e.target.value;

    if (field === "province") {
      setProvince(value);
      setDistrict("");
    }
    if (field === "district") setDistrict(value);
    if (field === "ward") setWard(value);
    if (field === "typeEvent") {
      const cat = categories.find((c) => c.name === value) || null;
      const genCat = categories.find((c) => c.name === value);
      setSelectedCategory(cat);
      updateGenerationForm("categories", genCat ? [genCat.id] : []);
      // updateGenerationForm("categoryIds", genCat ? [genCat.id] : []);
    }

    // Xóa lỗi nếu chọn lại giá trị
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: false }));
    }
  };

  const onChange = (content: string) => {
    setPost(content);
    // updateGenerationForm("description", content);
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
    const value = e.target.value;
    if (field === "eventName") {
      setEventName(value);
      updateGenerationForm("name", value);
    }
    if (field === "eventAddress") {
      setEventAddress(value);
      updateGenerationForm("venue", value);
    }
    if (field === "street") {
      setStreet(value);
      const location = `${value}, ${ward}, ${province}, ${district}`;
      updateGenerationForm("location", location);
    }
    if (field === "nameOrg") {
      setNameOrg(value);
      updateGenerationForm("organizer", value);
    }
    if (field === "infoOrg") {
      setInfoOrg(value);
      updateGenerationForm("organizerDescription", value);
    }
    if (field === "ward") setWard(value);
    if (field === "logoOrg") setLogoOrg(value);

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: false }));
    }
  };

  const handleUpdateEvent = async () => {
    try {

      await updateEvent(Number(currentEventId), {
        title: eventName,
        description: post,
        isOnline: eventTypeSelected === "online" || eventTypeSelected === "Online",
        venue: eventAddress,
        orgName: nameOrg,
        orgDescription: infoOrg,
        categoryIds: selectedCategory ? [selectedCategory.id] : [],
        imgLogoUrl: logoOrg || "",            // use default image URL if needed
        imgPosterUrl: background || "",       // use default image URL if needed
        wardString: ward,
        streetString: street,
        districtId:
          allProvinces
            .find((p) => p.name.vi === province)
            ?.districts.find((d) => d.name.vi === district)?.id ?? undefined,
      });

      toast.success(transWithFallback('updateEventSuccess', 'Cập nhật sự kiện thành công, chuyển sang bước tiếp theo!'), { duration: 5000 });
      router.push(`/organizer/create-event/${currentEventId}?step=showing`);
    } catch (error: any) {
      console.error("Error updating event:", error);
      toast.error(error.message || transWithFallback('errorWhenUpdateEvent', 'Lỗi khi cập nhật sự kiện!'), { duration: 5000 });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: boolean } = {};

    if (!selectedCategory) newErrors.typeEvent = true;
    if (!eventName.trim()) newErrors.eventName = true;
    if (!nameOrg.trim()) newErrors.nameOrg = true;
    if (!infoOrg.trim()) newErrors.infoOrg = true;

    if (!currentEventId) {
      if (!background) {
        setImageErrors((prev) => ({ ...prev, background: "Vui lòng tải lên ảnh nền sự kiện" }));
        toast.error("Vui lòng tải lên ảnh nền sự kiện!", { duration: 5000 });
      }
      if (!logoOrg) {
        setImageLogoErrors((prev) => ({ ...prev, logoOrg: "Vui lòng tải lên logo ban tổ chức" }));
        toast.error("Vui lòng tải lên logo ban tổ chức!", { duration: 5000 });
      }
    }

    if (eventTypeSelected === "offline" || eventTypeSelected === "Offline") {
      if (!eventAddress.trim()) newErrors.eventAddress = true;
      if (!province) newErrors.province = true;
      if (!district) newErrors.district = true;
      if (!ward) newErrors.ward = true;
      if (!street.trim()) newErrors.street = true;

      if (!eventAddress.trim() || !province || !district || !ward || !street.trim()) {
        toast.error(transWithFallback('pleaseWhenFillLocation', 'Vui lòng nhập đầy đủ thông tin địa điểm sự kiện!'), { duration: 5000 });
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // if (currentEventId) {
      //     toast.success("Thông tin sự kiện đã tồn tại, chuyển sang bước tiếp theo.");
      //     router.push(`/organizer/create-event/${currentEventId}?step=showing`);
      //     return;
      // }
      const formData = new FormData();
      formData.append("title", eventName);
      formData.append("description", post);
      formData.append("isOnline", (eventTypeSelected === "online" || eventTypeSelected === "Online") ? "true" : "false");
      formData.append("venue", eventAddress); // Nếu offline, dùng tên địa điểm
      formData.append("orgName", nameOrg);
      formData.append("orgDescription", infoOrg);
      // Ví dụ categoryIds (bổ sung dữ liệu thật nếu có)

      if (selectedCategory) {
        formData.append("categoryIds", JSON.stringify([selectedCategory.id]));
      }

      // if (backgroundFile) {
      //     formData.append("imgPoster", backgroundFile);
      // }
      // if (logoOrgFile) {
      //     formData.append("imgLogo", logoOrgFile);
      // }

      if (currentEventId) {
        if (eventTypeSelected === "offline" || eventTypeSelected === "Offline") {
          formData.append("wardString", ward);
          formData.append("streetString", street);
          const selectedProvince = allProvinces.find((p) => p.name.vi === province);
          const selectedDistrict = selectedProvince?.districts.find((d) => d.name.vi === district);
          if (selectedDistrict) {
            formData.append("districtId", selectedDistrict.id.toString());
          } else {
            formData.append("districtId", "");
          }
        } else {
          formData.append("wardString", "");
          formData.append("streetString", "");
          formData.append("districtId", "");
        }
        await handleUpdateEvent();
      }
      else {
        if (eventTypeSelected === "offline" || eventTypeSelected === "Offline") {
          formData.append("wardString", ward);
          formData.append("streetString", street);

          const selectedProvince = allProvinces.find((p) => p.name.vi === province);
          const selectedDistrict = selectedProvince?.districts.find((d) => d.name.vi === district);
          if (selectedDistrict) {
            formData.append("districtId", selectedDistrict.id.toString());
          } else {
            formData.append("districtId", "");
          }
        }

        if (btnValidate === "Save") {
          toast.success(transWithFallback('formValid', 'Form hợp lệ! Đã lưu thông tin sự kiện!'), { duration: 5000 });
          onNextStep({
            title: eventName,
            description: post,
            isOnline: eventTypeSelected === "online" || eventTypeSelected === "Online",
            venue: eventAddress,
            orgName: nameOrg,
            orgDescription: infoOrg,
            categoryIds: selectedCategory ? [selectedCategory.id] : [],
            imgLogoUrl: logoOrg || "",            // use default image URL if needed
            imgPosterUrl: background || "",       // use default image URL if needed
            wardString: ward,
            streetString: street,
            districtId:
              allProvinces
                .find((p) => p.name.vi === province)
                ?.districts.find((d) => d.name.vi === district)?.id ?? undefined,
          });
          toast.success(transWithFallback("savedInfo", "Đã lưu thông tin sự kiện!"), { duration: 5000 });
        } else if (btnValidate === "Continue") {
          toast.success(transWithFallback("formValid", "Form hợp lệ! Sẽ chuyển sang bước tiếp theo!"), { duration: 5000 });
          onNextStep({
            title: eventName,
            description: post,
            isOnline: eventTypeSelected === "online" || eventTypeSelected === "Online",
            venue: eventAddress,
            orgName: nameOrg,
            orgDescription: infoOrg,
            categoryIds: selectedCategory ? [selectedCategory.id] : [],
            imgLogoUrl: logoOrg || "",            // use default image URL if needed
            imgPosterUrl: background || "",       // use default image URL if needed
            wardString: ward,
            streetString: street,
            districtId:
              allProvinces
                .find((p) => p.name.vi === province)
                ?.districts.find((d) => d.name.vi === district)?.id ?? undefined,
          });
        }
      }
    }
  };

  //Xét điều kiện cho button của AI
  const [isFormValid, setIsFormValid] = useState(false);
  useEffect(() => {
    const isOffline = eventTypeSelected === "offline" || eventTypeSelected === "Offline";
    const requiredFieldsFilled =
      eventName.trim() !== "" && nameOrg.trim() !== "" && infoOrg.trim() !== "" && post.trim() !== "" && selectedCategory !== null && background !== null && logoOrg !== null &&
      (!isOffline || (eventAddress.trim() !== "" && province.trim() !== "" && district.trim() !== "" && ward.trim() !== "" && street.trim() !== ""));
    setIsFormValid(requiredFieldsFilled);
  }, [
    eventName, nameOrg, infoOrg, post, selectedCategory, background, logoOrg, eventAddress, province, district, ward, street, eventTypeSelected
  ]);

  const eventDetails: EventDescriptionGenDto = {
    name: eventName,
    isOnlineEvent: eventTypeSelected === "online",
    location: `${street}, ${ward}, ${district}, ${province}`,
    venue: eventAddress,
    organizer: nameOrg,
    organizerDescription: infoOrg,
    categories: selectedCategory ? [selectedCategory.name] : []
  };

  return (
    <>
      <Toaster position="top-center" />
      <div className="flex justify-center mb-6">
        <form className="w-full max-w-4xl mx-auto mb-6" onSubmit={handleSubmit} id="event-form">
          <EventImageUpload
            background={background}
            handleUpload={handleUpload}
            imageErrors={imageErrors}
            eventName={eventName}
            handleInputChange={handleInputChange}
            errors={errors}
          />

          <EventLocationInput
            eventTypeSelected={eventTypeSelected} eventAddress={eventAddress}
            province={province} district={district} ward={ward} street={street}
            errors={errors} provinces={allProvinces.map((p) => p.name.vi)}
            districts={
              province
                ? allProvinces.find((p) => p.name.vi === province)?.districts.map((d) => d.name.vi) || []
                : []
            }
            createdLocations={createdLocations}
            // wards={wards}
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChange}
            setEventTypeSelected={setEventTypeSelected}
            updateGenerationForm={updateGenerationForm}
          />

          <div className="mt-3 p-6 lg:p-8 rounded-lg shadow-sm w-full max-w-5xl mx-auto" style={{ backgroundColor: "rgba(158, 245, 207, 0.2)", border: "1.5px solid #9EF5CF" }}>
            {/* Thể loại sự kiện */}
            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full px-3">
                <SelectField
                  label={transWithFallback('eventCategory', 'Thể loại sự kiện')}
                  options={categories.map((cat) => cat.name)}
                  value={selectedCategory ? selectedCategory.name : ""}
                  onChange={(e) => handleSelectChange(e, "typeEvent")}
                  error={errors.typeEvent}
                  required
                />
              </div>
            </div>
          </div>

          <div className="mt-3 p-6 lg:p-8 rounded-lg shadow-sm w-full max-w-5xl mx-auto" style={{ backgroundColor: "rgba(158, 245, 207, 0.2)", border: "1.5px solid #9EF5CF" }}>
            {/* Thông tin sự kiện */}
            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full px-3">
                <p className="block text-sm font-bold mb-2">
                  <span className="text-red-500">* </span> {transWithFallback('eventInfo', 'Thông tin sự kiện')}
                </p>

                {post && (
                  <div className="boder ">
                    <TextEditor key={locale} eventDetails={!eventDetailInfo ? eventDetails : eventDetailInfo} content={post} onChange={onChange} isValidDescription={isFormValid} />
                  </div>
                )}
              </div>
            </div>
          </div>

          <OrganizationInfoForm
            logoOrg={logoOrg}
            nameOrg={nameOrg}
            infoOrg={infoOrg}
            handleUpload={handleUploadLogo}
            handleInputChange={handleInputChange}
            errors={errors}
            imageLogoErrors={imageLogoErrors}
          />
        </form>
      </div>
    </>
  );
}
