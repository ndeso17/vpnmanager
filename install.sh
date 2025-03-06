#!/bin/bash
pathNow=$PWD

# Pengecekan apakah dijalankan sebagai root
if [ "$EUID" -ne 0 ]; then
    echo "Error: Skrip ini harus dijalankan sebagai root atau dengan sudo!"
    exit 1
fi

# Minta input domain dari pengguna
echo "Masukkan nama domain (misalnya, contoh.com):"
read -r domain
if [ -z "$domain" ]; then
    echo "Error: Domain tidak boleh kosong!"
    exit 1
fi

if [ ! -f "${pathNow}/Tools/Web/vmessHost" ]; then
    echo "Error: File ${pathNow}/Tools/Web/vmessHost tidak ditemukan!"
    exit 1
fi
if [ ! -f "${pathNow}/Tools/Xray/config.json" ]; then
    echo "Error: File ${pathNow}/Tools/Xray/config.json tidak ditemukan!"
    exit 1
fi

sudo rm -f "/etc/nginx/sites-enabled/${domain}"
sudo ln -s "/etc/nginx/sites-available/${domain}" "/etc/nginx/sites-enabled/${domain}"
