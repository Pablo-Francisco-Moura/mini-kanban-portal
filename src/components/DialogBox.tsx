import { t } from "i18next";
import { Dialog } from "@mui/material";
import { Button } from "@mui/material";
import { TextField } from "@mui/material";
import { DialogTitle } from "@mui/material";
import { DialogContent } from "@mui/material";
import { DialogActions } from "@mui/material";
import type { ChangeEvent } from "react";
import type { TypeFieldsValues } from "../types/kanban";

interface Props {
  open: boolean;
  label: string;
  fields: string[];
  loading: boolean;
  newValues: TypeFieldsValues;
  action: () => Promise<void>;
  setNew: (values: TypeFieldsValues) => void;
  onClose: () => void;
}

export function DialogBox({
  open,
  label,
  fields,
  loading,
  newValues,
  action,
  setNew,
  onClose,
}: Props) {
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: string
  ) => {
    const { value } = e.target;
    setNew({ ...newValues, [field]: value });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{label}</DialogTitle>
      <DialogContent>
        {fields.map((field, index) => (
          <TextField
            key={`${index}-${label}-${field}`}
            name={field}
            label={t(field)}
            value={newValues[field] || ""}
            margin="dense"
            onChange={(e) => handleChange(e, field)}
            disabled={loading}
            autoFocus={index === 0}
            fullWidth
          />
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button
          onClick={action}
          disabled={fields.some((f) => !newValues[f]?.trim()) || loading}
          variant="contained"
        >
          Criar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
