import React from "react";
import { For, HStack, Stack, Table } from "@chakra-ui/react";
import { FaRegEdit } from "react-icons/fa";
import { useMutation } from "@tanstack/react-query";
import { baseUrl } from "../../../constants/global-variable.js";
import toast from "react-hot-toast";
import { queryClient } from "../../../utils/queryClient.js";
import { MdDelete } from "react-icons/md";
import { DialogTrigger } from "./dialog.jsx";
import InputEmployee from "./inputEmployee.jsx";


const EmployeeTable = ({ data }) => {
  if (!data.length) {
    return <h1>No hay ningun deto de empleado</h1>;
  }

  const mutation = useMutation({
    mutationFn: async (id) => {
      console.log("Mutation funtion", id);
      const response = await fetch(baseUrl + "/" + id, {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }
      return data;
    },
    onError: (error) => {
      console.log(error.message);
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("Empleado eliminado correctamente");
      queryClient.invalidateQueries({ queryKey: ["employee_details"] });
    },
  });

  return (
    <Stack gap="10">
      <Table.Root size="md" variant="outline">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>ID</Table.ColumnHeader>
            <Table.ColumnHeader>Name</Table.ColumnHeader>
            <Table.ColumnHeader>Email</Table.ColumnHeader>
            <Table.ColumnHeader>Age</Table.ColumnHeader>
            <Table.ColumnHeader>Role</Table.ColumnHeader>
            <Table.ColumnHeader>Salary</Table.ColumnHeader>
            <Table.ColumnHeader>Actions</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data.map((item) => (
            <Table.Row key={item.id}>
              <Table.Cell>{item.id}</Table.Cell>
              <Table.Cell>{item.name}</Table.Cell>
              <Table.Cell>{item.email}</Table.Cell>
              <Table.Cell>{item.age}</Table.Cell>
              <Table.Cell>{item.role}</Table.Cell>
              <Table.Cell>{item.salary}</Table.Cell>
              <Table.Cell>
                <HStack gap={3}>
                  <MdDelete
                    size={20}
                    className="icon"
                    onClick={() => mutation.mutate(item.id)}
                  />
                  <InputEmployee data={item} type="edit"> {/* CORREGIDO: era "update" */}
                    <DialogTrigger asChild>
                      <FaRegEdit size={20} className="icon" />
                    </DialogTrigger>
                  </InputEmployee>
                </HStack>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Stack>
  );
};

export default EmployeeTable;