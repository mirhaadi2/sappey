import React, { useState, useEffect } from "react";
import { Input, Select, Checkbox } from "../common";
import { INDIAN_STATES } from "../../constants";
import { QuestionIcon, CheckCircle, XCircle, Spinner } from "@phosphor-icons/react";
import { AddressFormProps } from "../../types";
import { useCheckPincodeServiceability } from "../../api/integrations/delhivery";

const AddressForm: React.FC<AddressFormProps> = ({
    form,
    addressFieldPrefix,
    showSaveInfo = false,
    phoneLabel = "Phone",
    onPincodeServiceabilityChange,
}) => {
    const { register, formState: { errors }, watch } = form;
    const { mutate: checkPincode, isPending } = useCheckPincodeServiceability();

    const pincode = watch(`${addressFieldPrefix}.pinCode`);
    const [pincodeServiceable, setPincodeServiceable] = useState<boolean | null>(null);

    // Check pincode serviceability when pincode changes
    useEffect(() => {
        if (pincode && pincode.length === 6 && /^\d{6}$/.test(pincode)) {
            checkPincode(pincode, {
                onSuccess: (response) => {
                    const isServiceable = response.data?.delivery_codes?.some((item: any) => {
                        const details = item.postal_code;
                        return (
                            details?.pin?.toString() === pincode.toString() &&
                            details?.pre_paid === 'Y' && details?.cod === 'Y' && details?.cash === 'Y' &&
                            details?.repl === 'Y' && details?.pickup === 'Y'
                        );
                    }) || false;

                    setPincodeServiceable(isServiceable);
                    onPincodeServiceabilityChange?.(isServiceable);
                },
                onError: () => {
                    setPincodeServiceable(false);
                    onPincodeServiceabilityChange?.(false);
                }
            });
        } else {
            setPincodeServiceable(null);
            onPincodeServiceabilityChange?.(null);
        }
    }, [pincode, checkPincode]);

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
                <div className="relative">
                    <Input
                        label="PIN Code"
                        name={field("pinCode")}
                        register={register}
                        error={getNestedError("pinCode")}
                        placeholder="PIN code"
                        type="text"
                        maxLength={6}
                    />
                    {/* Serviceability Indicator */}
                    {pincode && pincode.length === 6 && (
                        <div className="absolute right-3 top-[70%] -translate-y-1/2 flex items-center gap-1">
                            {isPending ? (
                                <Spinner size={16} className="animate-spin text-slate-400" />
                            ) : pincodeServiceable === true ? (
                                <CheckCircle size={16} weight="fill" className="text-emerald-500" />
                            ) : pincodeServiceable === false ? (
                                <XCircle size={16} weight="fill" className="text-red-500" />
                            ) : null}
                        </div>
                    )}
                </div>
            </div>

            {/* Serviceability Message */}
            {pincode && pincode.length === 6 && pincodeServiceable !== null && !isPending && (
                <div className={`text-xs font-medium px-3 py-2 rounded-lg flex items-center gap-2 ${pincodeServiceable
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                    {pincodeServiceable ? (
                        <>
                            <CheckCircle size={14} weight="fill" />
                            This PIN code is serviceable for delivery
                        </>
                    ) : (
                        <>
                            <XCircle size={14} weight="fill" />
                            This PIN code is not serviceable for delivery
                        </>
                    )}
                </div>
            )}

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
                    className="absolute right-4 top-[calc(50%+12px)] -translate-y-1/2 text-slate-400 cursor-help z-10"
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
