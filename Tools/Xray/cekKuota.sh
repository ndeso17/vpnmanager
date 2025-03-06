#!/bin/bash
CONFIG_FILE="/home/ndeso/vpnmanager/Tools/Xray/config.json"
SERVER="127.0.0.1:10002"
QUOTA_FILE="/home/ndeso/vpnmanager/Tools/Xray/quota_usage.txt" # File untuk menyimpan data kuota

# Fungsi untuk membaca total sebelumnya dari file
load_quota_from_file() {
    local user=$1
    if [ -f "$QUOTA_FILE" ] && grep -q "^$user:" "$QUOTA_FILE"; then
        grep "^$user:" "$QUOTA_FILE" | cut -d: -f2
    else
        echo 0
    fi
}

# Fungsi untuk menyimpan total ke file
update_quota_file() {
    local user=$1
    local total=$2
    if [ -f "$QUOTA_FILE" ]; then
        grep -v "^$user:" "$QUOTA_FILE" >"$QUOTA_FILE.tmp"
        mv "$QUOTA_FILE.tmp" "$QUOTA_FILE"
    fi
    echo "$user:$total" >>"$QUOTA_FILE"
}

# Cek config file
if [ ! -f "$CONFIG_FILE" ] || ! jq -e . "$CONFIG_FILE" >/dev/null 2>&1; then
    echo "Error: Config file tidak ada atau invalid." >&2
    echo "[]"
    exit 1
fi

# Ambil daftar client
mapfile -t CLIENTS < <(jq -r '.inbounds[0].settings.clients[] | [.email, .quota, .expiry] | join(":")' "$CONFIG_FILE" 2>/dev/null)
if [ $? -ne 0 ] || [ ${#CLIENTS[@]} -eq 0 ]; then
    echo "Error: Gagal membaca client dari config." >&2
    echo "[]"
    exit 1
fi

# Inisialisasi array JSON
json="["

# Loop semua client
for CLIENT in "${CLIENTS[@]}"; do
    IFS=: read -r USER QUOTA EXPIRY <<<"$CLIENT"
    [ -z "$USER" ] && continue
    [ -z "$QUOTA" ] || [ "$QUOTA" -eq 0 ] && QUOTA=10737418240 # Default 10 GB dalam bytes

    # Ambil statistik dari Xray
    UPLINK=$(xray api stats --server=$SERVER -name "user>>>$USER>>>traffic>>>uplink" 2>/dev/null | grep "value" | awk '{print $2}')
    DOWNLINK=$(xray api stats --server=$SERVER -name "user>>>$USER>>>traffic>>>downlink" 2>/dev/null | grep "value" | awk '{print $2}')
    [ -z "$UPLINK" ] && UPLINK=0
    [ -z "$DOWNLINK" ] && DOWNLINK=0

    # Tambahkan data sebelumnya dari file
    PREVIOUS_TOTAL=$(load_quota_from_file "$USER")
    TOTAL=$((PREVIOUS_TOTAL + UPLINK + DOWNLINK))

    # Simpan total terbaru ke file
    update_quota_file "$USER" "$TOTAL"

    # Hitung sisa kuota dan kaib dalam bytes
    REMAINING=$((QUOTA - TOTAL))
    SISA_KUOTA=0
    KAIB=0

    # Jika bataskuota - usedkuota <= 0, sisa kuota = 0, kaib = usedkuota - bataskuota
    if [ "$REMAINING" -le 0 ]; then
        SISA_KUOTA=0
        KAIB=$((TOTAL - QUOTA)) # Hutang dalam bytes
        if [ "$KAIB" -lt 0 ]; then
            KAIB=0 # Pastikan kaib tidak negatif
        fi
    else
        SISA_KUOTA="$REMAINING" # Dalam bytes
    fi

    # Pastikan bataskuota dan usedkuota tidak negatif
    if [ "$TOTAL" -lt 0 ]; then
        TOTAL=0
    fi
    if [ "$QUOTA" -lt 0 ]; then
        QUOTA=0
    fi

    # Buat objek JSON untuk client ini (semua dalam bytes)
    obj="{"
    obj+="\"username\": \"$USER\","
    obj+="\"bataskuota\": $QUOTA,"
    obj+="\"usedkuota\": $TOTAL,"
    obj+="\"sisakuota\": $SISA_KUOTA,"
    obj+="\"kaib\": $KAIB"
    obj+="}"

    # Tambahkan ke array JSON
    if [ "$json" != "[" ]; then
        json+=","
    fi
    json+="$obj"
done

json+="]"

# Format JSON menggunakan jq jika tersedia, jika tidak tampilkan apa adanya
if command -v jq >/dev/null 2>&1; then
    echo "$json" | jq .
else
    echo "$json"
fi
