import React from "react";
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "./select.jsx";
import { createListCollection } from "@chakra-ui/react";
import { Portal } from "@chakra-ui/react";
import { Field } from "./field.jsx";

const roles = createListCollection({
  items: [
    { label: "HR", value: "HR" },
    { label: "Developer", value: "Developer" },
    { label: "Manager", value: "Manager" },
    { label: "Sales", value: "Sales" },
    { label: "Intern", value: "Intern" },
  ],
});

// Modificado: ahora acepta props value y onChange
const SelectRole = ({ value, onChange }) => {
  return (
    <Field label="Rol" required>
      <SelectRoot
        collection={roles}
        size="sm"
        width="100%"
        value={value ? [value] : []} // Conectado al valor del estado
        onValueChange={(details) => {
          // Maneja el cambio de valor
          if (details.value && details.value.length > 0) {
            onChange(details.value[0]);
          } else {
            onChange("");
          }
        }}
      >
        <SelectTrigger>
          <SelectValueText placeholder="Seleccione un rol" />
        </SelectTrigger>
        <Portal>
          <SelectContent className="select">
            {roles.items.map((role) => (
              <SelectItem item={role} key={role.value}>
                {role.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Portal>
      </SelectRoot>
    </Field>
  );
};

export default SelectRole;