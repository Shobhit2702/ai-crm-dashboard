"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

function Dropdown({ trigger, children, align = "right" }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -5 }}
            transition={{ duration: 0.1 }}
            className={cn(
              "absolute z-50 mt-2 w-56 rounded-lg border border-slate-200 bg-white p-1 shadow-md focus:outline-hidden dark:border-slate-800 dark:bg-slate-950",
              align === "right" ? "right-0" : "left-0"
            )}
          >
            <div onClick={() => setIsOpen(false)}>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DropdownItem({ children, onClick, className, ...props }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center rounded-md px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 focus:bg-slate-50 focus:outline-hidden dark:text-slate-300 dark:hover:bg-slate-900/60 dark:focus:bg-slate-900/60 transition-colors duration-150",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

function DropdownSeparator() {
  return <div className="my-1 h-px bg-slate-100 dark:bg-slate-800" />;
}

export { Dropdown, DropdownItem, DropdownSeparator };
