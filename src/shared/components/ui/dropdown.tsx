import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface DropdownItem {
  label: string;
  onClick: () => void;
}

interface DropdownProps {
  /** Renders the trigger button, supplying current open state and a toggle callback */
  trigger: (isOpen: boolean, toggle: () => void) => React.ReactNode;
  /** List of select options/items */
  items: DropdownItem[];
  /** Optional header title above items */
  title?: string;
  /** Which direction the menu should open relative to trigger */
  direction?: "down" | "up";
  /** How to align horizontal edges */
  align?: "left" | "right";
  /** Custom wrapper CSS classes */
  className?: string;
  /** Custom dropdown menu container CSS classes */
  menuClassName?: string;
}

export function Dropdown({
  trigger,
  items,
  title,
  direction = "down",
  align = "right",
  className = "",
  menuClassName = "",
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggle = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleItemClick = (onClick: () => void) => {
    onClick();
    setIsOpen(false);
  };

  // Menu positioning classes
  const positionClasses = [
    direction === "up" ? "bottom-full mb-2" : "top-full mt-2",
    align === "left" ? "left-0" : "right-0",
  ].join(" ");

  // Slide transition direction based on layout
  const motionVariants = {
    initial: { opacity: 0, y: direction === "up" ? 10 : -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: direction === "up" ? 10 : -10 },
  };

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      {trigger(isOpen, toggle)}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={motionVariants}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={`absolute w-56 rounded-lg border border-borderColor bg-bgCard p-2 shadow-elevated z-50 backdrop-blur-xl ${positionClasses} ${menuClassName}`}
          >
            {title && (
              <div className="text-scale-caption font-semibold text-textSecondary mb-2 px-2 pt-1">
                {title}
              </div>
            )}
            <div className="space-y-0.5">
              {items.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleItemClick(item.onClick)}
                  className="w-full rounded-md px-3 py-2 text-left text-scale-caption font-medium transition-colors hover:bg-bgCardHover active:bg-bgCardHover text-textPrimary hover:text-textPrimary"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
