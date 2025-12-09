import PropTypes from 'prop-types';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Avatar, Chip, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';

// third party
import { useDispatch } from 'react-redux';

// project import
import * as actionTypes from 'store/actions';

// assets
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// ==============================|| NAV ITEM ||============================== //

const NavItem = ({ item, level }) => {
  const theme = useTheme();
  const location = useLocation();
  const dispatch = useDispatch();

  const Icon = item.icon;
  const itemIcon = item.icon ? <Icon color="inherit" /> : <ArrowForwardIcon color="inherit" fontSize={level > 0 ? 'inherit' : 'default'} />;

  // Detect URL aktif
  const isActive = location.pathname === item.url;

  // target jika external
  let itemTarget = '';
  if (item.target) {
    itemTarget = '_blank';
  }

  let listItemProps = { component: Link, to: item.url };
  if (item.external) {
    listItemProps = { component: 'a', href: item.url };
  }

  return (
    <ListItemButton
      disabled={item.disabled}
      sx={{
        borderRadius: '5px',
        marginBottom: '5px',
        pl: `${level * 16}px`,
        backgroundColor: isActive ? theme.palette.primary.lighter : 'transparent',
        '&:hover': {
          backgroundColor: theme.palette.primary.lighter,
          color: theme.palette.primary.main
        }
      }}
      selected={isActive}
      onClick={() => dispatch({ type: actionTypes.MENU_OPEN, isOpen: item.id })}
      to={item.url}
      target={itemTarget}
      {...listItemProps}
    >
      <ListItemIcon sx={{ minWidth: 25, color: isActive ? theme.palette.primary.main : 'inherit' }}>{itemIcon}</ListItemIcon>
      <ListItemText
        primary={
          <Typography sx={{ pl: 1.4 }} variant={isActive ? 'subtitle1' : 'body1'} color={isActive ? 'primary.main' : 'inherit'}>
            {item.title}
          </Typography>
        }
      />
      {item.chip && (
        <Chip
          color={item.chip.color}
          variant={item.chip.variant}
          size={item.chip.size}
          label={item.chip.label}
          avatar={item.chip.avatar && <Avatar>{item.chip.avatar}</Avatar>}
        />
      )}
    </ListItemButton>
  );
};

NavItem.propTypes = {
  item: PropTypes.object,
  level: PropTypes.number
};

export default NavItem;
