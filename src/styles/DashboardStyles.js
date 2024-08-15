import { styled } from '@mui/material/styles';
import { Paper, Box } from '@mui/material';

export const DashboardContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: theme.palette.background.default,
}));

export const CategoryContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
  marginBottom: theme.spacing(2),
}));

export const WidgetContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

export const WidgetPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[2],
}));
