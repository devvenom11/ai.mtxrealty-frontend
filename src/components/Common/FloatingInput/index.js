import React, { useState } from "react";

export default function FloatingInput({ max, maxLength, noMargin, defaultValue = "", id, label, inputType, isFull, width, onKeyDown, isRequired, onChange, value, className, isError, disabled }) {
  return (
    <>
      <div className={`floating-input relative ${noMargin ? "w-full" : "mb-5"} overflow-hidden rounded-xl ${width}`}>
        <input
          defaultValue={!value ? defaultValue : undefined}
          disabled={disabled}
          value={value && value}
          type={inputType}
          required={isRequired}
          max={max}
          maxLength={maxLength}
          onKeyDown={
            onKeyDown
              ? (e) => {
                  onKeyDown(e);
                }
              : () => {}
          }
          onChange={(e) => (onChange ? onChange(e.target.value) : () => {})}
          id={id}
          className={`${className} ${isFull && "w-full"} h-12 rounded-xl border ${isError ? "border-red-400" : "border-gray-200"} py-3 px-4 text-sm font-semibold leading-none focus:outline-none`}
          placeholder="name@example.com"
        />
        <label
          htmlFor={id}
          className="pointer-events-none absolute top-0 left-0 h-full origin-left transform px-4 py-4 text-sm font-semibold leading-none text-gray-400 transition-all duration-100 ease-in-out "
        >
          {label}
        </label>
      </div>
    </>
  );
}
