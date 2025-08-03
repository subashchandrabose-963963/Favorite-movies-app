import { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchFavorites, addFavorite, updateFavorite, deleteFavorite } from "./api/favoritesMedia";
import type { FavoriteEntry } from "./api/favoritesMedia";
import EntryForm from "./components/EntryForm";   
import FavoritesTable from "./components/FavoritesTable";
import { Dialog, DialogTitle, DialogContent, Snackbar, Alert, IconButton, CircularProgress, Box, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function App() {
  const [entries, setEntries] = useState<FavoriteEntry[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [editingEntry, setEditingEntry] = useState<FavoriteEntry | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [snackbar, setSnackbar] = useState<{open: boolean, message: string, severity: "success"|"error"}>({open: false, message: "", severity: "success"});
  const PAGE_SIZE = 20;

  const [loading, setLoading] = useState(true); // for initial fetch and global API calls
  const [apiLoading, setApiLoading] = useState(false); // for all API calls (fetch, add, update, delete)

  useEffect(() => {
    (async () => {
      setLoading(true);
      setApiLoading(true);
      await loadMoreEntries(page, true);
      setLoading(false);
      setApiLoading(false);
    })();
  }, []);

  async function loadMoreEntries(currentPage: number, isInitial = false) {
    setApiLoading(true);
    try {
      const res = await fetchFavorites(currentPage, PAGE_SIZE);
      setEntries(prev => isInitial ? res.entries : [...prev, ...res.entries]);
      setHasMore(res.entries.length === PAGE_SIZE);
      setPage(currentPage + 1);
    } catch {
      setHasMore(false);
      setSnackbar({open: true, message: "Failed to fetch entries", severity: "error"});
    } finally {
      setApiLoading(false);
    }
  }


  function handleAdd() {
    setEditingEntry(null);
    setShowForm(true);
  }

  function handleEdit(entry: FavoriteEntry) {
    setEditingEntry(entry);
    setShowForm(true);
  }

  async function handleDelete(id: number) {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      setApiLoading(true);
      try {
        await deleteFavorite(id);
        setEntries(prev => prev.filter((e) => e.id !== id));
        setSnackbar({open: true, message: "Deleted!", severity: "success"});
      } catch {
        setSnackbar({open: true, message: "Failed to delete", severity: "error"});
      } finally {
        setApiLoading(false);
      }
    }
  }

  async function handleFormSubmit(form: FavoriteEntry) {
    setShowForm(false);
    setApiLoading(true);
    try {
      if (editingEntry) {
        await updateFavorite(editingEntry.id!, form);
        setEntries(prev => prev.map(e => e.id === editingEntry.id ? {...form, id: editingEntry.id} : e));
      } else {
        const newEntry = await addFavorite(form);
        setEntries(prev => [newEntry, ...prev]);
      }
      setSnackbar({open: true, message: "Saved successfully!", severity: "success"});
    } catch {
      setSnackbar({open: true, message: "Failed to save", severity: "error"});
    } finally {
      setApiLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-4xl font-bold text-gray-800 relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-1/3 after:h-1 after:bg-blue-600 after:rounded-full">
            Favorite Movies & TV Shows
          </h1>
          <button 
            onClick={handleAdd} 
            className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium
              transform transition-all duration-200 ease-in-out hover:scale-105
              hover:bg-blue-700 hover:shadow-lg active:scale-95 
              flex items-center gap-2 cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Add New
          </button>
        </div>

        {(loading || apiLoading) ? (
          <Box 
            display="flex" 
            flexDirection="column" 
            alignItems="center" 
            justifyContent="center" 
            minHeight="300px" 
            py={4} 
            position="relative"
            sx={{
              animation: 'fadeIn 0.5s ease-in-out',
              '@keyframes fadeIn': {
                '0%': { opacity: 0 },
                '100%': { opacity: 1 }
              }
            }}
          >
            <CircularProgress 
              color="primary" 
              size={56} 
              thickness={4} 
              sx={{
                animation: 'pulse 1.5s ease-in-out infinite',
                '@keyframes pulse': {
                  '0%': { opacity: 0.6 },
                  '50%': { opacity: 1 },
                  '100%': { opacity: 0.6 }
                }
              }}
            />
            {/* <Typography 
              variant="body1" 
              color="text.secondary" 
              mt={3}
              sx={{ 
                fontWeight: 500,
                letterSpacing: '0.5px',
                opacity: 0.8
              }}
            >
              Loading your content...
            </Typography> */}
          </Box>
        ) : (
          <InfiniteScroll
            dataLength={entries.length}
            next={() => loadMoreEntries(page)}
            hasMore={hasMore}
            loader={
              <Box 
                display="flex" 
                flexDirection="column" 
                alignItems="center" 
                justifyContent="center" 
                py={6}
                sx={{
                  animation: 'slideUp 0.3s ease-out',
                  '@keyframes slideUp': {
                    '0%': { transform: 'translateY(20px)', opacity: 0 },
                    '100%': { transform: 'translateY(0)', opacity: 1 }
                  }
                }}
              >
                <CircularProgress 
                  color="primary" 
                  size={44} 
                  thickness={4} 
                  sx={{
                    animation: 'pulse 1.5s ease-in-out infinite',
                    '@keyframes pulse': {
                      '0%': { opacity: 0.6 },
                      '50%': { opacity: 1 },
                      '100%': { opacity: 0.6 }
                    }
                  }}
                />
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  mt={2}
                  sx={{ 
                    fontWeight: 500,
                    letterSpacing: '0.5px',
                    opacity: 0.8
                  }}
                >
                  Loading more entries...
                </Typography>
              </Box>
            }
          >
            <FavoritesTable entries={entries} onEdit={handleEdit} onDelete={handleDelete} />
          </InfiniteScroll>
        )}

        <Dialog 
          open={showForm} 
          onClose={() => setShowForm(false)} 
          maxWidth="sm" 
          fullWidth
          TransitionProps={{
            timeout: 400
          }}
          PaperProps={{
            elevation: 8,
            sx: {
              borderRadius: 3,
              animation: 'dialogFade 0.4s ease-out',
              '@keyframes dialogFade': {
                '0%': { transform: 'scale(0.95)', opacity: 0 },
                '100%': { transform: 'scale(1)', opacity: 1 }
              }
            }
          }}
        >
          <DialogTitle 
            sx={{ 
              m: 0, 
              p: 2, 
              pr: 6, 
              fontWeight: 700, 
              fontSize: 20, 
              letterSpacing: '0.5px', 
              color: 'primary.main',
              background: 'linear-gradient(to right, #f8fafc, #f1f5f9)',
              borderBottom: '1px solid',
              borderColor: 'divider'
            }}
          >
            {editingEntry ? 'Edit Favorite Movies & Tvshows' : 'Add New Favorite Movies & Tvshows'}
            <IconButton
              aria-label="close"
              onClick={() => setShowForm(false)}
              sx={{
                position: 'absolute',
                right: 16,
                top: 16,
                color: (theme) => theme.palette.grey[500],
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  color: (theme) => theme.palette.grey[700],
                  transform: 'rotate(90deg)'
                }
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ p: 0 }}>
            <EntryForm
              initialData={editingEntry ?? undefined}
              onSubmit={handleFormSubmit}
              onCancel={() => setShowForm(false)}
            />
          </DialogContent>
        </Dialog>
        
        <Snackbar 
          open={snackbar.open} 
          autoHideDuration={3000} 
          onClose={() => setSnackbar(s => ({...s, open: false}))}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          sx={{
            '& .MuiAlert-root': {
              borderRadius: 2,
              boxShadow: 3,
              animation: 'slideIn 0.3s ease-out',
              '@keyframes slideIn': {
                '0%': { transform: 'translateX(100%)', opacity: 0 },
                '100%': { transform: 'translateX(0)', opacity: 1 }
              }
            }
          }}
        >
          <Alert 
            severity={snackbar.severity}
            sx={{
              alignItems: 'center',
              '& .MuiAlert-icon': {
                fontSize: '1.5rem'
              },
              '& .MuiAlert-message': {
                fontSize: '0.95rem',
                fontWeight: 500
              }
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
}
