import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  IconButton,
  useMediaQuery,
  TextField
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PropTypes from "prop-types";
import type { FavoriteEntry } from "../api/favoritesMedia";
import { useTheme } from "@mui/material/styles";



import { useState, useMemo } from "react";

function FavoritesTable({ entries, onEdit, onDelete }: {
  entries: FavoriteEntry[],
  onEdit: (entry: FavoriteEntry) => void,
  onDelete: (id: number) => void
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [search, setSearch] = useState("");

  // Filter logic: match title, director, type, location, yearTime
  const filteredEntries = useMemo(() => {
    const s = search.trim().toLowerCase();
    if (!s) return entries;
    return entries.filter(entry =>
      [entry.title, entry.director, entry.type, entry.location, entry.yearTime, entry.budget, entry.duration]
        .some(val => (val ?? '').toString().toLowerCase().includes(s))
    );
  }, [entries, search]);

  return (
    <>
      <Paper sx={{ p: 2, mb: 2, display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'stretch' : 'center', gap: 2 }}>
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={search}
          onChange={e => setSearch(e.target.value)}
          fullWidth={isMobile}
          sx={{ maxWidth: isMobile ? '100%' : '350px', width: '100%' }}
        />
      </Paper>
      <TableContainer 
        component={Paper} 
        className="shadow-lg" 
        sx={{ 
          width: '100%',
          borderRadius: 2,
          boxShadow: 3,
          '& .MuiTable-root': {
            borderCollapse: 'separate',
            borderSpacing: '0 8px',
            tableLayout: 'fixed'
          }
        }}
      >
        <Table size={isMobile ? "small" : "medium"} aria-label="favorites table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ 
                fontWeight: 'bold', 
                backgroundColor: theme.palette.primary.main, 
                color: 'white',
                width: '20%',
                '&:first-of-type': { borderTopLeftRadius: 8 },
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>Title</TableCell>
              <TableCell sx={{ 
                fontWeight: 'bold', 
                backgroundColor: theme.palette.primary.main, 
                color: 'white',
                width: '10%'
              }}>Type</TableCell>
              <TableCell sx={{ 
                fontWeight: 'bold', 
                backgroundColor: theme.palette.primary.main, 
                color: 'white',
                width: '15%'
              }}>Director</TableCell>
              <TableCell sx={{ 
                fontWeight: 'bold', 
                backgroundColor: theme.palette.primary.main, 
                color: 'white',
                width: '10%'
              }}>Budget</TableCell>
              <TableCell sx={{ 
                fontWeight: 'bold', 
                backgroundColor: theme.palette.primary.main, 
                color: 'white',
                width: '15%'
              }}>Location</TableCell>
              <TableCell sx={{ 
                fontWeight: 'bold', 
                backgroundColor: theme.palette.primary.main, 
                color: 'white',
                width: '10%'
              }}>Duration</TableCell>
              <TableCell sx={{ 
                fontWeight: 'bold', 
                backgroundColor: theme.palette.primary.main, 
                color: 'white',
                width: '10%'
              }}>Year/Time</TableCell>
              <TableCell sx={{ 
                fontWeight: 'bold', 
                backgroundColor: theme.palette.primary.main, 
                color: 'white',
                '&:last-child': { borderTopRightRadius: 8 }
              }} align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEntries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                  No entries found.
                </TableCell>
              </TableRow>
            ) : (
              filteredEntries.map(entry => (
                <TableRow
                  key={entry.id}
                  hover
                  sx={{
                    transition: 'all 0.2s ease',
                    '&:hover': { 
                      backgroundColor: `${theme.palette.primary.light}15`,
                      transform: 'scale(1.01)',
                      boxShadow: 1
                    },
                    '& td': {
                      borderBottom: `1px solid ${theme.palette.divider}`,
                      padding: '16px'
                    }
                  }}
                  tabIndex={0}
                  aria-label={`Favorite entry: ${entry.title}`}
                >
                  <TableCell sx={{ 
                    fontWeight: 500,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {entry.title}
                  </TableCell>
                  <TableCell sx={{ 
                    color: theme.palette.primary.main,
                    fontWeight: 500,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {entry.type}
                  </TableCell>
                  <TableCell sx={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {entry.director}
                  </TableCell>
                  <TableCell sx={{ 
                    color: theme.palette.success.main,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {entry.budget}
                  </TableCell>
                  <TableCell sx={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {entry.location}
                  </TableCell>
                  <TableCell sx={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {entry.duration}
                  </TableCell>
                  <TableCell sx={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {entry.yearTime}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={() => onEdit(entry)}
                      size="small"
                      color="primary"
                      aria-label={`Edit ${entry.title}`}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => onDelete(entry.id!)}
                      size="small"
                      color="error"
                      aria-label={`Delete ${entry.title}`}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

FavoritesTable.propTypes = {
  entries: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string.isRequired,
    type: PropTypes.string,
    director: PropTypes.string,
    budget: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    location: PropTypes.string,
    duration: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    yearTime: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  })).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default FavoritesTable;
