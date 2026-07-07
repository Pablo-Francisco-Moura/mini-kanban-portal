import {
  Box,
  CircularProgress,
  LinearProgress,
  Paper,
  Typography,
  useTheme,
} from "@mui/material";
import { t } from "i18next";

interface Props {
  open: boolean;
  countdownSeconds?: number;
  progressPercent?: number;
  errorMessage?: string;
}

export function LoadingState({
  open,
  countdownSeconds = 60,
  progressPercent = 0,
  errorMessage,
}: Props) {
  if (!open) return null;

  const theme = useTheme();
  const overlayBg =
    theme.palette.mode === "dark" ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.7)";

  return (
    <div
      role="status"
      aria-busy="true"
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: overlayBg,
        zIndex: 1400,
        pointerEvents: "auto",
        backdropFilter: "blur(6px)",
      }}
    >
      <Paper
        elevation={8}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          padding: 3,
          borderRadius: 2,
          minWidth: 360,
          maxWidth: "80%",
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 56,
              height: 56,
              borderRadius: "50%",
            }}
          >
            <CircularProgress color="primary" />
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, color: theme.palette.text.primary }}
            >
              {t("loading_db")}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {errorMessage
                ? errorMessage
                : t("countdown", { seconds: countdownSeconds })}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ width: "100%" }}>
          <LinearProgress variant="determinate" value={progressPercent} />
        </Box>

        <Typography variant="caption" color="text.secondary">
          {t("progress_label", { percent: progressPercent })}
        </Typography>
      </Paper>
    </div>
  );
}
