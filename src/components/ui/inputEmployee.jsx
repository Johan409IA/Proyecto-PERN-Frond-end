import { Button, Portal, Input, VStack } from "@chakra-ui/react";
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "./dialog.jsx";
import { Field } from "./field.jsx";
import SelectRole from "./selectRole.jsx";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { baseUrl } from "../../../constants/global-variable.js";
import { queryClient } from "../../../utils/queryClient.js";

const InputEmployee = ({ children, type = "add", data }) => {
  const [open, setOpen] = useState(false);

  // Mejorado: inicialización del estado
  const [info, setInfo] = useState({
    name: "",
    email: "",
    age: "",
    salary: "",
    role: "",
  });

  // Efecto para actualizar el estado cuando cambian los datos
  useEffect(() => {
    if (type === "edit" && data) {
      setInfo({
        name: data.name || "",
        email: data.email || "",
        age: data.age || "",
        salary: data.salary || "",
        role: data.role || "",
      });
    } else {
      setInfo({
        name: "",
        email: "",
        age: "",
        salary: "",
        role: "",
      });
    }
  }, [type, data]);

  function handleChange(e) {
    setInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleRoleChange(selectedRole) {
    setInfo((prev) => ({ ...prev, role: selectedRole }));
  }

  console.log("Datos del formulario:", info);

  const addEmployeeMutation = useMutation({
    mutationFn: async (employeeData) => {
      console.log("Enviando datos al servidor (AGREGAR):", employeeData);

      const response = await fetch(baseUrl, {
        method: "POST",
        body: JSON.stringify(employeeData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Respuesta del servidor:", response.status);

      const data = await response.json();
      console.log("Datos de respuesta:", data);

      if (!response.ok) {
        throw new Error(data.error || data.message || "Error del servidor");
      }
      return data;
    },
    onError: (error) => {
      console.error("Error en la mutación:", error);
      toast.error(error.message || "Error al agregar empleado");
    },
    onSuccess: (data) => {
      setOpen(false);
      toast.success("Empleado agregado con éxito");
      queryClient.invalidateQueries({ queryKey: ["employee_details"] });
      // Limpiar el formulario solo en modo agregar
      setInfo({
        name: "",
        email: "",
        age: "",
        salary: "",
        role: "",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (employeeData) => {
      console.log("Enviando datos al servidor (ACTUALIZAR):", employeeData);

      const response = await fetch(`${baseUrl}/${employeeData.id}`, {
        method: "PUT",
        body: JSON.stringify(employeeData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      console.log("Respuesta de actualización:", data);

      if (!response.ok) {
        throw new Error(data.error || data.message || "Error del servidor");
      }
      return data;
    },
    onError: (error) => {
      console.error("Error en la mutación de actualización:", error);
      toast.error(error.message || "Error al actualizar empleado");
    },
    onSuccess: (data) => {
      setOpen(false);
      toast.success("Empleado actualizado con éxito");
      queryClient.invalidateQueries({ queryKey: ["employee_details"] });
      // NO limpiar el estado en modo edición
    },
  });

  const requiredFields = ["name", "age", "salary", "email"];

  function handleSubmit() {
    // Validación mejorada
    for (const key of requiredFields) {
      if (!info[key] || !info[key].toString().trim()) {
        toast.error(`El campo ${key} es requerido`);
        return;
      }
    }

    // Validación específica para edad
    if (info.age && (isNaN(info.age) || parseInt(info.age) < 18)) {
      toast.error("La edad debe ser mayor a 18 años");
      return;
    }

    // Validación para email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (info.email && !emailRegex.test(info.email)) {
      toast.error("Ingrese un email válido");
      return;
    }

    const infoToSend = { ...info, role: info.role || null };

    // CORREGIDO: Error de sintaxis crítico
    if (type === "add") {
      addEmployeeMutation.mutate(infoToSend);
    } else {
      // Validar que existe el ID en modo edición
      if (!data || !data.id) {
        toast.error("Error: No se encontró el ID del empleado");
        return;
      }
      updateMutation.mutate({ ...infoToSend, id: data.id });
    }
  }

  return (
    <DialogRoot
      placement="center"
      motionPreset="slide-in-bottom"
      open={open}
      onOpenChange={(e) => setOpen(e.open)}
    >
      {children}
      <Portal>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {type === "add" ? "Agregar empleado" : "Editar empleado"}
            </DialogTitle>
          </DialogHeader>
          <DialogBody>
            <VStack gap="4" alignItems="flex-start">
              <Field label="Nombre" required>
                <Input
                  name="name"
                  placeholder="Ingrese su nombre"
                  value={info.name}
                  onChange={handleChange}
                />
              </Field>
              <Field label="Correo" required>
                <Input
                  name="email"
                  placeholder="Ingrese su correo"
                  type="email"
                  value={info.email}
                  onChange={handleChange}
                />
              </Field>
              <Field label="Edad" required>
                <Input
                  name="age"
                  placeholder="Ingrese su edad"
                  type="number"
                  min="18"
                  value={info.age}
                  onChange={handleChange}
                />
              </Field>
              <Field label="Salario" required>
                <Input
                  name="salary"
                  placeholder="Ingrese su salario"
                  type="number"
                  min="0"
                  value={info.salary}
                  onChange={handleChange}
                />
              </Field>
              <SelectRole value={info.role} onChange={handleRoleChange} />
            </VStack>
          </DialogBody>
          <DialogFooter>
            <DialogActionTrigger asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogActionTrigger>
            <Button
              onClick={handleSubmit}
              isLoading={
                type === "add"
                  ? addEmployeeMutation.isPending
                  : updateMutation.isPending
              }
              loadingText="Guardando..."
            >
              {type === "add" ? "Agregar" : "Actualizar"}
            </Button>
          </DialogFooter>
          <DialogCloseTrigger />
        </DialogContent>
      </Portal>
    </DialogRoot>
  );
};

export default InputEmployee;
