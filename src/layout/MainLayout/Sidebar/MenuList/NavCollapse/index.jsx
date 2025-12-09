import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// material-ui
import { Typography, ListItemIcon, ListItemText, Collapse, List, ListItemButton } from '@mui/material';

// project import
import NavItem from '../NavItem';

// assets
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// ==============================|| NAV COLLAPSE ||============================== //

const NavCollapse = ({ menu, level }) => {
  const location = useLocation();
  const [open, setOpen] = React.useState(false);

  // buka menu otomatis jika ada item anak yang cocok dengan path
  useEffect(() => {
    if (menu.children) {
      menu.children.forEach((child) => {
        if (child.url === location.pathname) {
          setOpen(true);
        }
      });
    }
  }, [location, menu.children]);

  const handleClick = () => setOpen(!open);

  const menus = menu.children.map((item) => {
    switch (item.type) {
      case 'collapse':
        return <NavCollapse key={item.id} menu={item} level={level + 1} />;
      case 'item':
        return <NavItem key={item.id} item={item} level={level + 1} />;
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Menu Items Error
          </Typography>
        );
    }
  });

  const Icon = menu.icon;
  const menuIcon = menu.icon ? <Icon /> : <ArrowForwardIcon fontSize={level > 0 ? 'inherit' : 'default'} />;

  return (
    <>
      <ListItemButton
        sx={{
          borderRadius: '5px',
          mb: 0.6,
          pl: `${level * 16}px`
        }}
        onClick={handleClick}
      >
        <ListItemIcon sx={{ minWidth: !menu.icon ? '25px' : 'unset' }}>{menuIcon}</ListItemIcon>
        <ListItemText
          primary={
            <Typography variant="body1" color={open ? 'primary.main' : 'inherit'} sx={{ pl: 1.9 }}>
              {menu.title}
            </Typography>
          }
        />
        {open ? <ExpandLess sx={{ fontSize: '1rem' }} /> : <ExpandMore sx={{ fontSize: '1rem' }} />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {menus}
        </List>
      </Collapse>
    </>
  );
};

NavCollapse.propTypes = {
  menu: PropTypes.object,
  level: PropTypes.number
};

export default NavCollapse;
