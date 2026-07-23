import { t } from "i18next";
import {
  Dialog,
  Button,
  TextField,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
} from "@mui/material";
import type { ChangeEvent } from "react";
import type { TypeFieldsValues, TypeColumnColor } from "../types/kanban";
import Alert from "@mui/material/Alert";

interface Props {
  open: boolean;
  label: string;
  fields: string[];
  loading: boolean;
  newValues: TypeFieldsValues;
  action: () => Promise<void>;
  setNew: (values: TypeFieldsValues) => void;
  onClose: () => void;
  colors?: TypeColumnColor[];
  errorMessage?: string | null;
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
  colors = [],
  errorMessage = null,
}: Props) {
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: string,
  ) => {
    const { value } = e.target;
    setNew({ ...newValues, [field]: value });
  };

  const handleColorChange = (value: string) => {
    setNew({ ...newValues, colorId: value });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{label}</DialogTitle>
      <DialogContent>
        {errorMessage && (
          <Alert severity="error" sx={{ mb: 1 }}>
            {errorMessage}
          </Alert>
        )}

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

        {colors && colors.length > 0 && (
          <FormControl fullWidth margin="dense">
            <InputLabel id="column-color-select-label">{t("color")}</InputLabel>
            <Select
              labelId="column-color-select-label"
              id="column-color-select"
              value={newValues.colorId || ""}
              label={t("color")}
              onChange={(e) => handleColorChange(String(e.target.value))}
              disabled={loading}
            >
              <MenuItem value="">
                <em>{t("none")}</em>
              </MenuItem>
              {colors.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  <Box
                    component="span"
                    sx={{
                      display: "inline-block",
                      width: 14,
                      height: 14,
                      borderRadius: "50%",
                      backgroundColor: c.hex,
                      verticalAlign: "middle",
                      mr: 1,
                    }}
                  />
                  {c.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          {t("cancel") || "Cancelar"}
        </Button>
        <Button
          onClick={action}
          disabled={fields.some((f) => !newValues[f]?.trim()) || loading}
          variant="contained"
        >
          {t("create")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
