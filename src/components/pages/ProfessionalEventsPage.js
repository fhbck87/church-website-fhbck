import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box, Container, Typography, Grid, Button, Card, CardContent, CardMedia, Chip, Dialog, DialogContent, DialogActions,
  IconButton, useTheme, useMediaQuery, alpha, Stack, Avatar
} from '@mui/material';
import {
  CalendarToday, LocationOn, Close, Group, FamilyRestroom, Church, People, EventAvailable,
  AccessTime, ArrowForward, Description as DescriptionIcon
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { usePageContent } from '../../cms';
import { FadeIn, SlideUp, StaggerContainer, StaggerItem, SectionLabel } from '../common/animations';

const ProfessionalEventsPage = () => {
  const { t } = useTranslation();
  const content = usePageContent('events');
  const theme = useTheme();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const events = (content.items || []).length
    ? content.items.map((e, i) => ({
        id: e.id || i, title: e.title || '', description: e.description || '',
        date: e.date || e.eventDate || '', time: e.eventTime || e.time || '',
        location: e.location || '', category: (e.category || e.eventType || '').toLowerCase(),
        image: e.imageUrl || e.image || '', attendees: e.attendees || '',
        features: e.features || [], color: '#0F4C81',
      }))
    : [
        { id: 1, title: 'Sunday Worship Service', description: 'Join us for our weekly worship service with inspiring music, biblical teaching, and community fellowship.', date: 'Every Sunday', time: '10:00 AM', location: 'Main Sanctuary', category: 'worship', image: '/images/banner/pastor-sermon_1.JPG', attendees: '200+', features: ['Live Worship', 'Biblical Teaching', "Children's Church", 'Fellowship'], color: '#0F4C81' },
        { id: 2, title: 'Youth Night', description: 'An exciting evening for teenagers with games, worship, and relevant messages about faith and life.', date: 'Every Friday', time: '7:00 PM', location: 'Youth Center', category: 'youth', image: '/images/banner/youth-banner.jpg', attendees: '45+', features: ['Games', 'Worship', 'Bible Study', 'Snacks'], color: '#2196F3' },
        { id: 3, title: "Women's Bible Study", description: "A time for women to gather, study God's Word, and build meaningful relationships.", date: 'Every Tuesday', time: '7:00 PM', location: 'Fellowship Hall', category: 'women', image: '/images/banner/women-banner.jpg', attendees: '30+', features: ['Bible Study', 'Prayer', 'Fellowship', 'Refreshments'], color: '#9C27B0' },
        { id: 4, title: "Men's Breakfast", description: 'Monthly gathering for men to enjoy breakfast, fellowship, and spiritual encouragement.', date: 'First Saturday', time: '8:00 AM', location: 'Fellowship Hall', category: 'men', image: '/images/banner/men-banner.JPG', attendees: '25+', features: ['Breakfast', 'Fellowship', 'Testimony', 'Prayer'], color: '#FF9800' },
        { id: 5, title: 'Family Fun Day', description: 'A fun-filled day for the whole family with games, food, and activities for all ages.', date: 'Monthly', time: '2:00 PM', location: 'Church Grounds', category: 'family', image: '/images/banner/children-banner.JPG', attendees: '100+', features: ['Games', 'Food', 'Activities', 'Prizes'], color: '#4CAF50' },
        { id: 6, title: 'Prayer Meeting', description: 'Join us for a powerful time of prayer and intercession for our church and community.', date: 'Every Wednesday', time: '6:30 PM', location: 'Prayer Room', category: 'prayer', image: '/images/photo/prayer-1.jpg', attendees: '20+', features: ['Corporate Prayer', 'Testimonies', 'Worship', 'Fellowship'], color: '#C9A227' },
      ];

  const categoryMap = {};
  events.forEach(e => { if (e.category) categoryMap[e.category.toLowerCase()] = true; });
  const apiCategories = Object.keys(categoryMap).map(cat => ({ id: cat, name: cat.charAt(0).toUpperCase() + cat.slice(1) }));
  const categories = apiCategories.length > 0
    ? [{ id: 'all', name: 'All Events' }, ...apiCategories]
    : [{ id: 'all', name: 'All Events' }, { id: 'worship', name: 'Worship' }, { id: 'youth', name: 'Youth' }, { id: 'women', name: 'Women' }, { id: 'men', name: 'Men' }, { id: 'family', name: 'Family' }, { id: 'prayer', name: 'Prayer' }];

  const filteredEvents = selectedCategory === 'all' ? events : events.filter(e => e.category === selectedCategory);

  const handleOpenModal = (event) => { setSelectedEvent(event); setOpenModal(true); };
  const handleCloseModal = () => { setOpenModal(false); setTimeout(() => setSelectedEvent(null), 300); };

  return (
    <Box sx={{ backgroundColor: 'background.default' }}>
      {/* Hero */}
      <Box sx={{
        background: 'linear-gradient(135deg, rgba(10,53,96,0.85), rgba(15,76,129,0.85)), url(/images/banner/DSC_2131.jpg) center / cover no-repeat',
        color: '#fff', pt: { xs: 14, md: 20 }, pb: { xs: 12, md: 18 }, position: 'relative',
      }}>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <FadeIn>
            <Box textAlign="center" maxWidth="800px" mx="auto">
              <SectionLabel sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: '#fff' }}>Events</SectionLabel>
              <Typography variant="h1" component="h1" sx={{ fontWeight: 800, mb: 2, fontSize: { xs: '2.2rem', md: '3.2rem' } }}>
                {content.hero?.title || 'Church Events'}
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 400, opacity: 0.9, lineHeight: 1.7, mb: 2, fontSize: { xs: '1rem', md: '1.1rem' } }}>
                {content.hero?.subtitle || '"Let us not give up meeting together, but let us encourage one another."'}
              </Typography>
              <Typography variant="body1" sx={{ fontStyle: 'italic', opacity: 0.7, color: '#C9A227', fontWeight: 500 }}>Hebrews 10:25</Typography>
            </Box>
          </FadeIn>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 10 } }}>
        {/* Categories */}
        <FadeIn>
          <Box textAlign="center" mb={6}>
            <SectionLabel>Browse</SectionLabel>
            <Typography variant="h3" component="h2" sx={{ fontWeight: 800, color: 'text.primary', fontSize: { xs: '1.8rem', md: '2.2rem' } }}>
              Event Categories
            </Typography>
          </Box>
        </FadeIn>
        <StaggerContainer stagger={0.08}>
          <Grid container spacing={2} sx={{ mb: 8 }}>
            {categories.map((category) => (
              <Grid item xs={6} sm={4} md={3} lg={2} key={category.id}>
                <StaggerItem>
                  <motion.div whileHover={{ y: -4, scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Card
                      onClick={() => setSelectedCategory(category.id)}
                      sx={{ cursor: 'pointer', textAlign: 'center', py: 2, borderRadius: 3, border: `2px solid ${selectedCategory === category.id ? theme.palette.primary.main : alpha(theme.palette.divider, 0.5)}`, bgcolor: selectedCategory === category.id ? alpha(theme.palette.primary.main, 0.06) : 'background.paper', transition: 'all 0.3s ease', '&:hover': { borderColor: 'primary.main' } }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: selectedCategory === category.id ? 700 : 500, color: selectedCategory === category.id ? 'primary.main' : 'text.primary' }}>
                        {category.name}
                      </Typography>
                    </Card>
                  </motion.div>
                </StaggerItem>
              </Grid>
            ))}
          </Grid>
        </StaggerContainer>

        {/* Events Grid */}
        <FadeIn>
          <Box textAlign="center" mb={6}>
            <Typography variant="h3" component="h2" sx={{ fontWeight: 800, color: 'text.primary', fontSize: { xs: '1.8rem', md: '2.2rem' } }}>
              Upcoming Events
            </Typography>
          </Box>
        </FadeIn>
        <StaggerContainer stagger={0.1}>
          <Grid container spacing={4}>
            {filteredEvents.map((event) => (
              <Grid item xs={12} sm={6} md={4} key={event.id} sx={{ display: 'flex' }}>
                <StaggerItem>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 4, overflow: 'hidden', border: '1px solid', borderColor: 'divider', transition: 'all 0.35s ease', '&:hover': { transform: 'translateY(-6px)', boxShadow: '0 20px 50px rgba(15, 76, 129, 0.12)' } }}>
                    <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                      <CardMedia component="img" height="200" image={event.image} alt={event.title} sx={{ transition: 'transform 0.5s ease', '&:hover': { transform: 'scale(1.05)' } }} />
                      <Box sx={{ position: 'absolute', inset: 0, background: alpha(theme.palette.primary.main, 0.8), opacity: 0, transition: 'opacity 0.3s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', '&:hover': { opacity: 1 } }}>
                        <Button variant="contained" onClick={() => handleOpenModal(event)} sx={{ bgcolor: '#fff', color: 'primary.main', fontWeight: 600 }}>View Details</Button>
                      </Box>
                    </Box>
                    <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5, color: 'text.primary' }}>{event.title}</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.7, flexGrow: 1 }}>{event.description}</Typography>
                      <Stack spacing={1} sx={{ mb: 2 }}>
                        {[{ icon: <CalendarToday sx={{ fontSize: 16, color: 'primary.main' }} />, text: event.date },
                          { icon: <AccessTime sx={{ fontSize: 16, color: 'primary.main' }} />, text: event.time },
                          { icon: <LocationOn sx={{ fontSize: 16, color: 'primary.main' }} />, text: event.location },
                          { icon: <People sx={{ fontSize: 16, color: 'primary.main' }} />, text: `${event.attendees} attending` },
                        ].map((item, i) => (
                          <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {item.icon}
                            <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.85rem' }}>{item.text}</Typography>
                          </Box>
                        ))}
                      </Stack>
                      <Stack direction="row" flexWrap="wrap" gap={0.8} mb={2}>
                        {event.features.map((f, i) => (
                          <Chip key={i} label={f} size="small" sx={{ bgcolor: alpha(event.color, 0.08), color: event.color, fontWeight: 500, fontSize: '0.72rem' }} />
                        ))}
                      </Stack>
                      <Button variant="outlined" fullWidth onClick={() => handleOpenModal(event)} endIcon={<ArrowForward />} sx={{ borderColor: 'primary.main', color: 'primary.main', fontWeight: 600, '&:hover': { bgcolor: 'primary.main', color: '#fff' } }}>
                        Learn More
                      </Button>
                    </CardContent>
                  </Card>
                </StaggerItem>
              </Grid>
            ))}
          </Grid>
        </StaggerContainer>

        {/* CTA */}
        <FadeIn>
          <Box sx={{ mt: 10, py: 6, background: 'linear-gradient(135deg, #0F4C81, #0A3560)', borderRadius: 6, textAlign: 'center', position: 'relative', overflow: 'hidden', '&::before': { content: '""', position: 'absolute', inset: 0, background: 'url(/images/banner/DSC_2131.jpg)', backgroundSize: 'cover', opacity: 0.08 } }}>
            <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2 }}>
              <Typography variant="h4" component="h2" sx={{ fontWeight: 800, mb: 2, color: '#fff', fontSize: { xs: '1.6rem', md: '2rem' } }}>Join Our Next Event!</Typography>
              <Typography variant="body1" sx={{ mb: 4, color: 'rgba(255,255,255,0.8)', maxWidth: 500, mx: 'auto', lineHeight: 1.8 }}>
                We'd love to see you at our upcoming events. Come worship with us and grow in your faith.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5} justifyContent="center">
                <Button variant="outlined" component={RouterLink} to="/contact" sx={{ borderColor: '#fff', color: '#fff', fontWeight: 600, px: 4, '&:hover': { bgcolor: '#fff', color: '#0F4C81' } }}>Contact Us</Button>
                <Button variant="contained" component={RouterLink} to="/ministries" endIcon={<ArrowForward />} sx={{ bgcolor: 'secondary.main', color: '#fff', fontWeight: 700, px: 4, '&:hover': { bgcolor: 'secondary.dark' } }}>Explore Ministries</Button>
              </Stack>
            </Container>
          </Box>
        </FadeIn>
      </Container>

      {/* Event Modal */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 5, overflow: 'hidden' } }}>
        {selectedEvent && (
          <>
            <Box sx={{ p: 4, background: 'linear-gradient(135deg, #0F4C81, #0A3560)', color: '#fff', position: 'relative' }}>
              <IconButton onClick={handleCloseModal} sx={{ position: 'absolute', top: 16, right: 16, color: '#fff' }}><Close /></IconButton>
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>{selectedEvent.title}</Typography>
              <Typography variant="h6" sx={{ opacity: 0.9, color: '#C9A227' }}>{selectedEvent.date} at {selectedEvent.time}</Typography>
            </Box>
            <DialogContent sx={{ p: 4 }}>
              <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>{selectedEvent.description}</Typography>
              <Stack spacing={2} sx={{ mb: 3 }}>
                {[{ icon: <CalendarToday sx={{ color: 'primary.main' }} />, text: selectedEvent.date },
                  { icon: <AccessTime sx={{ color: 'primary.main' }} />, text: selectedEvent.time },
                  { icon: <LocationOn sx={{ color: 'primary.main' }} />, text: selectedEvent.location },
                  { icon: <People sx={{ color: 'primary.main' }} />, text: `${selectedEvent.attendees} attending` },
                ].map((item, i) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>{item.icon}<Typography variant="body2">{item.text}</Typography></Box>
                ))}
              </Stack>
              <Stack direction="row" flexWrap="wrap" gap={1}>
                {selectedEvent.features.map((f, i) => (
                  <Chip key={i} label={f} size="small" sx={{ bgcolor: alpha(selectedEvent.color, 0.08), color: selectedEvent.color, fontWeight: 500 }} />
                ))}
              </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 4, pt: 0 }}>
              <Button onClick={handleCloseModal} sx={{ color: 'text.secondary' }}>Close</Button>
              <Button variant="contained" component={RouterLink} to="/contact" sx={{ bgcolor: 'primary.main', fontWeight: 600 }}>Register for Event</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default ProfessionalEventsPage;
