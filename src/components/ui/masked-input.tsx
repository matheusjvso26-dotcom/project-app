import * as React from "react"
import { NumericFormat, PatternFormat, NumberFormatValues } from "react-number-format"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export interface MoneyInputProps extends Omit<React.ComponentProps<"input">, "onChange" | "value" | "type" | "ref"> {
    value?: number | null // value in cents
    onValueChange?: (cents: number) => void
}

export function MoneyInput({ value, onValueChange, className, ...props }: MoneyInputProps) {
    return (
        <NumericFormat
            customInput={Input}
            thousandSeparator="."
            decimalSeparator=","
            prefix="R$ "
            decimalScale={2}
            fixedDecimalScale
            value={typeof value === 'number' ? value / 100 : ''}
            onValueChange={(values: NumberFormatValues) => {
                if (onValueChange) {
                    const floatValue = values.floatValue || 0
                    onValueChange(Math.round(floatValue * 100))
                }
            }}
            className={cn("text-left font-medium", className)}
            {...props as any}
        />
    )
}

export interface MaskedInputProps extends Omit<React.ComponentProps<"input">, "onChange" | "value" | "type" | "ref"> {
    value?: string
    onValueChange?: (value: string) => void
}

export function CpfInput({ value, onValueChange, ...props }: MaskedInputProps) {
    return (
        <PatternFormat
            customInput={Input}
            format="###.###.###-##"
            mask="_"
            value={value}
            onValueChange={(values) => onValueChange && onValueChange(values.value)}
            {...props as any}
        />
    )
}

export function CnpjInput({ value, onValueChange, ...props }: MaskedInputProps) {
    return (
        <PatternFormat
            customInput={Input}
            format="##.###.###/####-##"
            mask="_"
            value={value}
            onValueChange={(values) => onValueChange && onValueChange(values.value)}
            {...props as any}
        />
    )
}

export function PhoneInput({ value, onValueChange, ...props }: MaskedInputProps) {
    return (
        <PatternFormat
            customInput={Input}
            format="(##) #####-####"
            mask="_"
            value={value}
            onValueChange={(values) => onValueChange && onValueChange(values.value)}
            {...props as any}
        />
    )
}
