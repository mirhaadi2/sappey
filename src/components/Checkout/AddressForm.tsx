import { Input, Select, Checkbox } from "../common";
import { INDIAN_STATES } from "../../constants";
import { QuestionIcon } from "@phosphor-icons/react";
import { AddressFormProps } from "../../types";

const AddressForm: React.FC<AddressFormProps> = ({
    form,
    addressFieldPrefix,
    showSaveInfo = false,
    phoneLabel = "Phone",
}) => {
    const { register, formState: { errors } } = form;

    const field = (fieldName: string) => `${addressFieldPrefix}.${fieldName}` as const;
    const getNestedError = (fieldName: string) => {
        const errorObj = errors[addressFieldPrefix] as any;
        return errorObj?.[fieldName];
    };

    return (
        <div className="space-y-4">
            <Select
                label="Country"
                name={field("country")}
                register={register}
                error={getNestedError("country")}
                options={[{ value: 'India', label: 'India' }]}
                placeholder="Select Country"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label="First Name"
                    name={field("firstName")}
                    register={register}
                    error={getNestedError("firstName")}
                    placeholder="First name"
                />
                <Input
                    label="Last Name"
                    name={field("lastName")}
                    register={register}
                    error={getNestedError("lastName")}
                    placeholder="Last name"
                />
            </div>

            <Input
                label="Address"
                name={field("address")}
                register={register}
                error={getNestedError("address")}
                placeholder="Address"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                    label="City"
                    name={field("city")}
                    register={register}
                    error={getNestedError("city")}
                    placeholder="City"
                />
                <Select
                    label="State"
                    name={field("state")}
                    register={register}
                    error={getNestedError("state")}
                    options={INDIAN_STATES.map(state => ({ value: state, label: state }))}
                    placeholder="Select State"
                />
                <Input
                    label="PIN Code"
                    name={field("pinCode")}
                    register={register}
                    error={getNestedError("pinCode")}
                    placeholder="PIN code"
                    type="text"
                    maxLength={6}
                />
            </div>

            <div className="relative group">
                <Input
                    label={phoneLabel}
                    name={field("phone")}
                    register={register}
                    error={getNestedError("phone")}
                    placeholder={phoneLabel}
                    type="tel"
                    maxLength={10}
                />
                <QuestionIcon
                    size={20}
                    className="absolute right-4 top-1/3 -translate-y-1/2 text-slate-400 cursor-help z-10"
                />
                <div className="absolute right-0 bottom-full mb-2 hidden group-hover:block transition-opacity duration-200">
                    <div className="bg-slate-800 text-white text-xs py-1.5 px-3 rounded-lg whitespace-nowrap">
                        In case we need to contact you about your order
                        <div className="absolute top-full right-5 -mt-1 border-4 border-transparent border-t-slate-800"></div>
                    </div>
                </div>
            </div>

            {showSaveInfo && (
                <Checkbox
                    label="Save this information for next time"
                    name="saveInfo"
                    checked={form.watch("saveInfo")}
                    onChange={(e) => form.setValue("saveInfo", e.target.checked)}
                />
            )}
        </div>
    );
};

export default AddressForm;
