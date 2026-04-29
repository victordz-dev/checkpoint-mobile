import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacityProps,
} from 'react-native';

type ButtonVariant = 'primary' | 'danger' | 'ghost';

interface CustomButtonProps extends TouchableOpacityProps {
  label: string;
  variant?: ButtonVariant;
  isLoading?: boolean;
}

const VARIANT_STYLES: Record<ButtonVariant, { background: string; text: string; border?: string }> = {
  primary: { background: '#6366f1', text: '#ffffff' },
  danger:  { background: 'transparent', text: '#ef4444', border: '#ef4444' },
  ghost:   { background: 'transparent', text: '#6366f1', border: '#6366f1' },
};

export function CustomButton({
  label,
  variant = 'primary',
  isLoading = false,
  disabled,
  style,
  ...rest
}: CustomButtonProps) {
  const v = VARIANT_STYLES[variant];

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: v.background,
          borderColor: v.border ?? 'transparent',
          borderWidth: v.border ? 1 : 0,
          opacity: disabled || isLoading ? 0.6 : 1,
        },
        style,
      ]}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading
        ? <ActivityIndicator color={v.text} />
        : <Text style={[styles.label, { color: v.text }]}>{label}</Text>
      }
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
});