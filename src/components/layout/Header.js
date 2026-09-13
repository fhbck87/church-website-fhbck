import React, { useState, useEffect, useRef } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import {
  Home,
  Info,
  Groups,
  Event,
  VolumeUp,
  ContactMail,
  KeyboardArrowDown,
  ChurchOutlined,
  FamilyRestroom,
  EscalatorWarning,
  ManOutlined,
  Favorite,
  Menu as MenuIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  useTheme,
  Box,
  Container,
  Divider,
  Collapse,
  ListItemIcon,
  Fade,
  Chip,
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import LanguageSwitcher from '../common/LanguageSwitcher';
import ThemeToggle from '../common/ThemeToggle';
import CMS_API from '../../services/cmsApi';

const StyledAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'scrolled',
})(({ theme, scrolled }) => ({
  zIndex: 1300,
  position: 'fixed',
  backgroundColor: scrolled
    ? `${alpha(theme.palette.background.paper, 0.88)} !important`
    : 'transparent !important',
  color: `${scrolled ? theme.palette.text.primary : (theme.palette.mode === 'dark' ? theme.palette.text.primary : '#0F4C81')} !important`,
  boxShadow: scrolled ? `0 8px 32px ${alpha(theme.palette.common.black, 0.08)}` : 'none',
  borderBottom: scrolled ? `1px solid ${alpha(theme.palette.divider, 0.12)}` : '1px solid transparent',
  backdropFilter: 'saturate(180%) blur(20px)',
  WebkitBackdropFilter: 'saturate(180%) blur(20px)',
  transition: 'background-color 0.4s cubic-bezier(0.25, 0.1, 0.25, 1), box-shadow 0.4s cubic-bezier(0.25, 0.1, 0.25, 1), border-color 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)',
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  minHeight: 72,
  padding: theme.spacing(0, 2),
  gap: theme.spacing(1),
  [theme.breakpoints.up('md')]: {
    minHeight: 80,
    padding: theme.spacing(0, 4),
  },
}));

const NavItem = styled(Box)(({ theme }) => ({
  position: 'relative',
}));

const NavButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'scrolled',
})(({ theme, scrolled }) => {
  const isDark = theme.palette.mode === 'dark';
  const navColor = scrolled
    ? theme.palette.text.primary
    : isDark
      ? '#E2E8F0'
      : '#0F4C81';
  return {
    position: 'relative',
    padding: theme.spacing(0.75, 1.6),
    borderRadius: '12px',
    fontSize: '0.88rem',
    fontWeight: 500,
    textTransform: 'none',
    color: `${navColor} !important`,
    letterSpacing: '0.3px',
    whiteSpace: 'nowrap',
    minWidth: 'unset',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: alpha(scrolled ? theme.palette.primary.main : (isDark ? '#E2E8F0' : '#0F4C81'), 0.1),
      color: `${scrolled ? theme.palette.primary.main : (isDark ? '#E2E8F0' : '#0F4C81')} !important`,
    },
    '&.active': {
      color: `${scrolled ? theme.palette.primary.main : (isDark ? '#E2E8F0' : '#0F4C81')} !important`,
      fontWeight: 700,
      backgroundColor: alpha(scrolled ? theme.palette.primary.main : (isDark ? '#E2E8F0' : '#0F4C81'), 0.1),
      '&::after': {
        content: '""',
        position: 'absolute',
        bottom: 2,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '30%',
        height: '2.5px',
        backgroundColor: scrolled ? theme.palette.primary.main : (isDark ? '#E2E8F0' : '#0F4C81'),
        borderRadius: '2px',
      },
    },
  };
});

const GiveButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(0.85, 2.4),
  borderRadius: '12px',
  fontWeight: 700,
  textTransform: 'none',
  fontSize: '0.88rem',
  letterSpacing: '0.4px',
  color: '#fff !important',
  background: 'linear-gradient(135deg, #C9A227 0%, #E0C060 100%)',
  boxShadow: `0 4px 16px ${alpha('#C9A227', 0.3)}`,
  whiteSpace: 'nowrap',
  transition: 'all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: `0 8px 24px ${alpha('#C9A227', 0.4)}`,
    color: '#fff !important',
  },
}));

const DropdownPaper = styled(motion.div)(({ theme }) => ({
  position: 'absolute',
  top: 'calc(100% + 12px)',
  left: '50%',
  transform: 'translateX(-50%)',
  minWidth: 240,
  borderRadius: 16,
  overflow: 'hidden',
  border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
  boxShadow: `0 20px 60px ${alpha(theme.palette.common.black, 0.15)}`,
  backgroundColor: theme.palette.background.paper,
  zIndex: 1400,
}));

const DropdownItem = styled(Button)(({ theme }) => ({
  width: '100%',
  justifyContent: 'flex-start',
  padding: theme.spacing(1.2, 2.4),
  borderRadius: 0,
  textTransform: 'none',
  fontSize: '0.88rem',
  fontWeight: 500,
  color: theme.palette.text.primary,
  gap: theme.spacing(1.2),
  transition: 'all 0.25s ease',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.06),
    color: theme.palette.primary.main,
    paddingLeft: theme.spacing(3),
  },
}));

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: 320,
    backgroundColor: theme.palette.background.paper,
    backgroundImage: 'none',
    boxShadow: `-12px 0 40px ${alpha(theme.palette.common.black, 0.12)}`,
    border: 'none',
  },
}));

const ministrySubItems = [
  { text: 'header.children', path: '/children-ministry', icon: <ChurchOutlined fontSize="small" />, color: '#4CAF50' },
  { text: 'header.youth', path: '/youth-ministry', icon: <EscalatorWarning fontSize="small" />, color: '#2196F3' },
  { text: 'header.men', path: '/men-ministry', icon: <ManOutlined fontSize="small" />, color: '#FF9800' },
  { text: 'header.women', path: '/women-ministry', icon: <FamilyRestroom fontSize="small" />, color: '#9C27B0' },
  { text: 'header.youngCouples', path: '/young-couples-ministry', icon: <Favorite fontSize="small" />, color: '#F44336' },
];

const navItems = [
  { text: 'header.home', path: '/', icon: <Home fontSize="small" /> },
  { text: 'header.about', path: '/about', icon: <Info fontSize="small" /> },
  { text: 'header.ministries', path: '/ministries', icon: <Groups fontSize="small" />, subItems: ministrySubItems },
  { text: 'header.events', path: '/events', icon: <Event fontSize="small" /> },
  { text: 'header.sermons', path: '/sermons', icon: <VolumeUp fontSize="small" /> },
  { text: 'header.contact', path: '/contact', icon: <ContactMail fontSize="small" /> },
  { text: 'header.give', path: '/giving', icon: <Favorite fontSize="small" />, isButton: true },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const dropdownRef = useRef(null);
  const [logoUrl, setLogoUrl] = useState('/images/logo/logo-blog1.png');
  const { t } = useTranslation();
  const theme = useTheme();
  const location = useLocation();

  useEffect(() => {
    CMS_API.fetchSettings().then(data => {
      if (data) {
        const map = {};
        if (Array.isArray(data)) {
          data.forEach(s => { map[s.settingKey] = s.settingValue; });
        }
        if (map.siteLogo) setLogoUrl(map.siteLogo);
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(null);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  const renderDesktopItem = (item) => {
    if (item.isButton) {
      return (
        <GiveButton
          key={item.text}
          component={RouterLink}
          to={item.path}
          startIcon={item.icon}
        >
          {t(item.text)}
        </GiveButton>
      );
    }

    if (item.subItems) {
      const open = dropdownOpen === item.text;
      return (
        <NavItem key={item.text} ref={open ? dropdownRef : null}>
          <NavButton
            scrolled={scrolled}
            className={isActive(item.path) ? 'active' : ''}
            component={RouterLink}
            to={item.path}
            onClick={() => setDropdownOpen(open ? null : item.text)}
            endIcon={
              <KeyboardArrowDown
                sx={{
                  fontSize: '1rem !important',
                  transition: 'transform 0.25s ease',
                  transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                }}
              />
            }
          >
            {t(item.text)}
          </NavButton>
          <AnimatePresence>
            {open && (
              <DropdownPaper
                ref={dropdownRef}
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <Box sx={{ px: 2.4, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', letterSpacing: '0.8px', textTransform: 'uppercase', fontSize: '0.68rem' }}>
                    {t('header.ministries')}
                  </Typography>
                </Box>
                {item.subItems.map((sub, index) => (
                  <DropdownItem
                    key={sub.text}
                    component={RouterLink}
                    to={sub.path}
                    onClick={() => setDropdownOpen(null)}
                    startIcon={
                      <Box sx={{ color: sub.color || (isActive(sub.path) ? 'primary.main' : 'text.secondary') }}>
                        {sub.icon}
                      </Box>
                    }
                    sx={{
                      fontWeight: isActive(sub.path) ? 700 : 500,
                      color: isActive(sub.path) ? (sub.color || 'primary.main') : 'text.primary',
                      '&:hover': sub.color ? {
                        color: sub.color,
                        backgroundColor: alpha(sub.color, 0.06),
                      } : {},
                    }}
                  >
                    {t(sub.text)}
                  </DropdownItem>
                ))}
              </DropdownPaper>
            )}
          </AnimatePresence>
        </NavItem>
      );
    }

    return (
      <NavButton
        key={item.text}
        scrolled={scrolled}
        component={RouterLink}
        to={item.path}
        className={isActive(item.path) ? 'active' : ''}
      >
        {t(item.text)}
      </NavButton>
    );
  };

  const renderMobileItem = (item) => (
    <React.Fragment key={item.text}>
      <ListItemButton
        component={RouterLink}
        to={item.path}
        onClick={item.subItems ? (e) => {
          e.preventDefault();
          setOpenSubMenu(openSubMenu === item.text ? null : item.text);
        } : undefined}
        sx={{
          borderRadius: 3,
          mb: 0.5,
          px: 2.5,
          py: 1.2,
          backgroundColor: isActive(item.path) && !item.subItems
            ? alpha(theme.palette.primary.main, 0.08)
            : 'transparent',
          '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.05) },
        }}
      >
        <ListItemIcon sx={{ minWidth: 38, color: isActive(item.path) ? 'primary.main' : 'text.secondary' }}>
          {item.icon}
        </ListItemIcon>
        <ListItemText
          primary={t(item.text)}
          primaryTypographyProps={{
            fontWeight: isActive(item.path) ? 700 : 500,
            fontSize: '0.95rem',
            color: isActive(item.path) && !item.subItems ? 'primary.main' : 'text.primary',
          }}
        />
        {item.subItems && (
          <KeyboardArrowDown
            sx={{
              fontSize: '1.1rem',
              color: 'text.secondary',
              transition: 'transform 0.25s ease',
              transform: openSubMenu === item.text ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          />
        )}
        {item.isButton && (
          <Chip
            label="Give"
            size="small"
            sx={{ ml: 1, bgcolor: alpha('#C9A227', 0.12), color: '#C9A227', fontWeight: 700, fontSize: '0.72rem' }}
          />
        )}
      </ListItemButton>

      <Collapse in={openSubMenu === item.text} timeout="auto" unmountOnExit>
        <List component="div" disablePadding sx={{ pl: 1 }}>
          {item.subItems?.map((sub) => (
            <ListItemButton
              key={sub.text}
              component={RouterLink}
              to={sub.path}
              sx={{
                pl: 5.5,
                borderRadius: 2.5,
                mb: 0.25,
                py: 0.85,
                backgroundColor: isActive(sub.path)
                  ? alpha(theme.palette.primary.main, 0.06)
                  : 'transparent',
                '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.04) },
              }}
            >
              <ListItemIcon sx={{ minWidth: 32, color: sub.color || (isActive(sub.path) ? 'primary.main' : 'text.disabled') }}>
                {sub.icon}
              </ListItemIcon>
              <ListItemText
                primary={t(sub.text)}
                primaryTypographyProps={{
                  fontSize: '0.87rem',
                  fontWeight: isActive(sub.path) ? 700 : 400,
                  color: isActive(sub.path) ? (sub.color || 'primary.main') : 'text.secondary',
                }}
              />
            </ListItemButton>
          ))}
        </List>
      </Collapse>
    </React.Fragment>
  );

  return (
    <>
      <StyledAppBar position="fixed" elevation={0} scrolled={scrolled} color="inherit">
        <Container maxWidth="xl" disableGutters>
          <StyledToolbar>
            <Box
              component={RouterLink}
              to="/"
              sx={{
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                gap: 1.6,
                flexShrink: 0,
                '&:hover .logo-ring': {
                  borderColor: '#C9A227',
                  transform: 'rotate(6deg) scale(1.05)',
                },
                '&:hover .brand-name': { color: '#C9A227' },
              }}
            >
              <Box
                className="logo-ring"
                sx={{
                  width: 52,
                  height: 52,
                  borderRadius: '50%',
                  border: `2.5px solid ${alpha(scrolled ? theme.palette.primary.main : (theme.palette.mode === 'dark' ? '#E2E8F0' : '#0F4C81'), 0.6)}`,
                  p: '3px',
                  backgroundColor: scrolled ? theme.palette.background.paper : (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.9)'),
                  transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
                  flexShrink: 0,
                  [theme.breakpoints.up('md')]: { width: 58, height: 58 },
                }}
              >
                <Box
                  component="img"
                  src={logoUrl}
                  alt="Church Logo"
                  sx={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              </Box>
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                <Typography
                  className="brand-name"
                  sx={{
                    fontFamily: '"Inter", sans-serif',
                    fontWeight: 800,
                    fontSize: { sm: '0.92rem', md: '1rem' },
                    background: scrolled
                      ? theme.palette.mode === 'dark'
                        ? 'linear-gradient(135deg, #6BA3D6 0%, #8DBEE6 40%, #D4B445 100%)'
                        : 'linear-gradient(135deg, #0F4C81 0%, #3A7BB8 40%, #C9A227 100%)'
                      : theme.palette.mode === 'dark'
                        ? 'linear-gradient(135deg, #E2E8F0 0%, #D4B445 100%)'
                        : 'linear-gradient(135deg, #0F4C81 0%, #3A7BB8 40%, #C9A227 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    lineHeight: 1.3,
                    transition: 'all 0.4s ease',
                    letterSpacing: '-0.01em',
                  }}
                >
                  First Haitian Baptist Church
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    color: scrolled ? 'text.secondary' : alpha(theme.palette.mode === 'dark' ? '#E2E8F0' : '#0F4C81', 0.7),
                    fontSize: '0.68rem',
                    letterSpacing: '1.5px',
                    textTransform: 'uppercase',
                    fontWeight: 500,
                    transition: 'color 0.4s ease',
                  }}
                >
                  Kissimmee, FL
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                flex: 1,
                justifyContent: 'center',
                gap: 0.5,
                mx: 2,
              }}
            >
              {navItems.map(renderDesktopItem)}
            </Box>

            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1, flexShrink: 0 }}>
              <ThemeToggle />
              <LanguageSwitcher />
            </Box>

            <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1, ml: 'auto' }}>
              <ThemeToggle />
              <LanguageSwitcher />
              <motion.div whileTap={{ scale: 0.9 }}>
                <IconButton
                  aria-label="open drawer"
                  onClick={() => setMobileOpen(!mobileOpen)}
                  sx={{
                    color: scrolled ? 'text.primary' : (theme.palette.mode === 'dark' ? '#E2E8F0' : '#0F4C81'),
                    borderRadius: '12px',
                    border: `1.5px solid ${alpha(scrolled ? theme.palette.divider : (theme.palette.mode === 'dark' ? '#E2E8F0' : '#0F4C81'), 0.2)}`,
                    p: '8px',
                    transition: 'all 0.25s ease',
                    '&:hover': {
                      backgroundColor: alpha(scrolled ? theme.palette.primary.main : (theme.palette.mode === 'dark' ? '#E2E8F0' : '#0F4C81'), 0.1),
                      borderColor: scrolled ? 'primary.main' : (theme.palette.mode === 'dark' ? '#E2E8F0' : '#0F4C81'),
                    },
                  }}
                >
                  <motion.div
                    animate={mobileOpen ? { rotate: 90 } : { rotate: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    {mobileOpen ? <CloseIcon fontSize="small" /> : <MenuIcon fontSize="small" />}
                  </motion.div>
                </IconButton>
              </motion.div>
            </Box>
          </StyledToolbar>
        </Container>
      </StyledAppBar>

      <StyledDrawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
      >
        <Box
          sx={{
            px: 3,
            pt: 3,
            pb: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.4 }}>
            <Box
              component="img"
              src={logoUrl}
              alt="Church Logo"
              sx={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }}
            />
            <Typography
              sx={{
                fontFamily: '"Inter", sans-serif',
                fontWeight: 800,
                fontSize: '0.9rem',
                background: 'linear-gradient(135deg, #0F4C81, #C9A227)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                lineHeight: 1.3,
              }}
            >
              FHBCK
            </Typography>
          </Box>
          <motion.div whileTap={{ scale: 0.9 }}>
            <IconButton
              onClick={() => setMobileOpen(false)}
              size="small"
              sx={{
                borderRadius: '10px',
                border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                '&:hover': { backgroundColor: alpha(theme.palette.error.main, 0.08), color: 'error.main' },
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </motion.div>
        </Box>

        <List sx={{ px: 1.5, pt: 2, pb: 2 }}>
          {navItems.map(renderMobileItem)}
        </List>

        <Box sx={{ mt: 'auto', px: 2.5, pb: 3 }}>
          <Divider sx={{ mb: 2 }} />
          <GiveButton
            fullWidth
            component={RouterLink}
            to="/giving"
            startIcon={<Favorite fontSize="small" />}
            sx={{ py: 1.3, fontSize: '0.95rem', borderRadius: '14px' }}
          >
            {t('header.give')}
          </GiveButton>
        </Box>
      </StyledDrawer>

      <Box sx={{ minHeight: { xs: 72, md: 80 } }} />
    </>
  );
};

export default Header;
