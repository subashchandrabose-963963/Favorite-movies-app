
import React, { useState } from "react";
import { Button, TextField, MenuItem, Box, Typography, Paper } from "@mui/material";
import PropTypes from "prop-types";
import type { FavoriteEntry } from "../api/favoritesMedia";

const types = ["Movie", "TV Show"];

function EntryForm({
  initialData,
  onSubmit,
  onCancel
}: {
  initialData?: FavoriteEntry,
  onSubmit: (form: FavoriteEntry) => void,
  onCancel: () => void
}) {
  const [form, setForm] = useState<FavoriteEntry>(
    initialData ?? {
      title: "",
      type: "Movie",
      director: "",
      budget: "",
      location: "",
      duration: "",
      yearTime: "",
    }
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title) e.title = "Title is required";
    if (!form.director) e.director = "Director is required";
    if (!form.budget) e.budget = "Budget is required";
    if (!form.location) e.location = "Location is required";
    if (!form.duration) e.duration = "Duration is required";
    if (!form.yearTime) e.yearTime = "Year/Time is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (validate()) onSubmit(form);
  };


  return (
    <Box display="flex" justifyContent="center" alignItems="center" width="100%">
      <Box width="100%">
        <Box 
          sx={{ 
            p: { xs: 2, sm: 3 },
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
          }}
        >
          <Box
            component="form"
            onSubmit={handleSubmit}
            aria-label={initialData ? "Edit Entry Form" : "Add Entry Form"}
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 2
            }}
          >
            {/* <Typography 
              variant="h6" 
              fontWeight={600} 
              color="text.primary" 
              mb={3}
              sx={{
                fontSize: '1.1rem',
                letterSpacing: '0.5px',
                position: 'relative',
                display: 'inline-block',
                '&:after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -6,
                  left: 0,
                  width: '40px',
                  height: '2px',
                  backgroundColor: (theme) => theme.palette.primary.main,
                  borderRadius: '2px'
                }
              }}
            >
              {initialData ? "Edit Entry" : "Add New Entry"}
            </Typography> */}
            <TextField 
              label="Title" 
              value={form.title} 
              name="title" 
              onChange={handleChange} 
              error={!!errors.title} 
              helperText={errors.title} 
              fullWidth 
              required 
              InputProps={{
                sx: { borderRadius: 2, backgroundColor: 'white' }
              }}
              size="small"
              inputProps={{ 'aria-label': 'Title' }}
            />
            <TextField 
              select 
              label="Type" 
              name="type" 
              value={form.type} 
              onChange={handleChange} 
              fullWidth 
              size="small"
              InputProps={{
                sx: { borderRadius: 2, backgroundColor: 'white' }
              }}
              inputProps={{ 'aria-label': 'Type' }}
            >
              {types.map((opt) => (
                <MenuItem value={opt} key={opt}>{opt}</MenuItem>
              ))}
            </TextField>
            <TextField 
              label="Director" 
              name="director" 
              value={form.director} 
              onChange={handleChange} 
              error={!!errors.director} 
              helperText={errors.director} 
              fullWidth 
              required 
              InputProps={{
                sx: { borderRadius: 2, backgroundColor: 'white' }
              }}
              size="small"
              inputProps={{ 'aria-label': 'Director' }}
            />
            <TextField 
              label="Budget" 
              name="budget" 
              value={form.budget} 
              onChange={handleChange} 
              error={!!errors.budget} 
              helperText={errors.budget} 
              fullWidth 
              required 
              size="small"
              InputProps={{
                sx: { borderRadius: 2, backgroundColor: 'white' }
              }}
              inputProps={{ 'aria-label': 'Budget' }}
            />
            <TextField 
              label="Location" 
              name="location" 
              value={form.location} 
              onChange={handleChange} 
              error={!!errors.location} 
              helperText={errors.location} 
              fullWidth 
              required 
              InputProps={{
                sx: { borderRadius: 2, backgroundColor: 'white' }
              }}
              size="small"
              inputProps={{ 'aria-label': 'Location' }}
            />
            <TextField 
              label="Duration" 
              name="duration" 
              value={form.duration} 
              onChange={handleChange} 
              error={!!errors.duration} 
              helperText={errors.duration} 
              fullWidth 
              required 
              size="small"
              InputProps={{
                sx: { borderRadius: 2, backgroundColor: 'white' }
              }}
              inputProps={{ 'aria-label': 'Duration' }}
            />
            <TextField 
              label="Year/Time" 
              name="yearTime" 
              value={form.yearTime} 
              onChange={handleChange} 
              error={!!errors.yearTime} 
              helperText={errors.yearTime} 
              fullWidth 
              required 
              InputProps={{
                sx: { borderRadius: 2, backgroundColor: 'white' }
              }}
              size="small"
              inputProps={{ 'aria-label': 'Year/Time' }}
            />
            <Box 
              display="flex" 
              justifyContent="flex-end" 
              gap={1.5} 
              // mt={3}
              sx={{
                borderTop: '1px solid',
                borderColor: 'divider',
                pt: 3,
                mx: -3,
                px: 3
              }}
            >
              <Button 
                variant="outlined" 
                onClick={onCancel} 
                aria-label="Cancel" 
                sx={{ 
                  minWidth: 100,
                  borderRadius: 1.5,
                  textTransform: 'none',
                  fontSize: '0.9rem',
                  py: 0.7,
                  color: 'text.secondary',
                  borderColor: 'divider',
                  '&:hover': {
                    borderColor: 'text.secondary',
                    backgroundColor: 'action.hover'
                  }
                }}
              >
                Cancel
              </Button>
              <Button 
                variant="contained" 
                color="primary" 
                type="submit" 
                aria-label="Save"
                sx={{ 
                  minWidth: 100,
                  borderRadius: 1.5,
                  textTransform: 'none',
                  fontSize: '0.9rem',
                  py: 0.7,
                  fontWeight: 500,
                  boxShadow: 'none',
                  '&:hover': {
                    boxShadow: 1,
                    backgroundColor: (theme) => theme.palette.primary.dark
                  }
                }}
              >
                Save
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

EntryForm.propTypes = {
  initialData: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string.isRequired,
    type: PropTypes.string,
    director: PropTypes.string,
    budget: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    location: PropTypes.string,
    duration: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    yearTime: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default EntryForm;
