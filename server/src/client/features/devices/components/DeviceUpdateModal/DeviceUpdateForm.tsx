import { trpc, type RouterOutput } from "@/utils/trpc";
import { deviceUpdateSchema } from "@/server/schema/device";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/client/shadcn/ui/label";
import { Input } from "@/client/shadcn/ui/input";
import { Button } from "@/client/shadcn/ui/button";
import clsx from "clsx";
import { useCallback, useMemo } from "react";
import { createToast } from "@/client/utils/createToast";

type ValidationSchema = z.infer<typeof deviceUpdateSchema>;

type DeviceByIdOutput = RouterOutput["device"]["getById"];

type DeviceUpdateFormProps = {
    device: DeviceByIdOutput;
    onUpdate: () => void;
};

export const DeviceUpdateForm = ({ device, onUpdate }: DeviceUpdateFormProps) => {
    const utils = trpc.useUtils();

    const updateDeviceMutation = trpc.device.update.useMutation({
        async onSuccess() {
            await utils.device.list.invalidate();
            createToast("Device updated successfully", "success");
        },
        onError(error) {
            createToast(`Failed to update device: ${error.message}`, "error");
        },
    });

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, isDirty },
    } = useForm<ValidationSchema>({
        resolver: zodResolver(deviceUpdateSchema),
        defaultValues: useMemo(
            () => ({
                id: device.id,
                buildingId: device.buildingId,
                roomId: device.roomId,
            }),
            [device],
        ),
    });

    const onSubmit = useCallback(
        async (data: ValidationSchema) => {
            try {
                await updateDeviceMutation.mutateAsync(data);
                onUpdate();
            } catch (error) {
                console.error({ error }, "Failed to update device");
            }
        },
        [onUpdate, updateDeviceMutation],
    );

    return (
        <form className="mb-4 px-8 pb-8" onSubmit={handleSubmit((data) => onSubmit(data))}>
            <div className="mb-4">
                <Label htmlFor="buildingId" className="mb-2">
                    Building ID
                </Label>
                <Input
                    className={clsx({
                        "border-red-500": errors.buildingId,
                    })}
                    id="buildingId"
                    type="text"
                    {...register("buildingId")}
                />
                {errors.buildingId && <p className="mt-2 text-xs italic text-red-500">{errors.buildingId?.message}</p>}
            </div>

            <div className="mb-4">
                <Label htmlFor="roomId" className="mb-2">
                    Room ID
                </Label>
                <Input
                    className={clsx({
                        "border-red-500": errors.roomId,
                    })}
                    id="roomId"
                    type="text"
                    {...register("roomId")}
                />
                {errors.roomId && <p className="mt-2 text-xs italic text-red-500">{errors.roomId?.message}</p>}
            </div>

            <div className="mb-6 text-center">
                <Button type="submit" disabled={isSubmitting || !isDirty}>
                    Confirm
                </Button>
            </div>
        </form>
    );
};
