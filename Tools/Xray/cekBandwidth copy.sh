#!/bin/bash
# Fungsi untuk mengambil bandwidth yang digunakan dari /proc/net/dev
parse_net_dev() {
    # Baca output dari /proc/net/dev
    output=$(cat /proc/net/dev)

    # Jika output kosong, kembalikan array kosong
    if [ -z "$output" ]; then
        echo "[]"
        exit 0
    fi

    # Ambil baris sebagai array
    IFS=$'\n' read -r -d '' -a lines <<<"$output"

    # Inisialisasi array JSON
    json="["

    # Parse baris data (mulai dari baris ke-3)
    for ((i = 3; i < ${#lines[@]}; i++)); do
        line="${lines[$i]}"
        if [ -z "$line" ]; then
            continue
        fi

        # Pisahkan interface dan data
        IFS=':' read -r interface data <<<"$line"
        interface=$(echo "$interface" | tr -d ' ')
        data=$(echo "$data" | tr -s ' ' | sed 's/^ //')

        # Ubah data menjadi array
        IFS=' ' read -r -a values <<<"$data"

        # Pastikan ada cukup kolom (minimal 2 untuk receive_bytes dan transmit_bytes)
        if [ ${#values[@]} -lt 9 ]; then
            echo "Warning: Data tidak lengkap untuk interface $interface" >&2
            continue
        fi

        # Ambil receive_bytes (kolom 1) dan transmit_bytes (kolom 9)
        receive_bytes="${values[0]}"
        transmit_bytes="${values[8]}"

        # Hitung total bandwidth yang digunakan (dalam bytes)
        used_bandwidth=$((receive_bytes + transmit_bytes))

        # Buat objek JSON untuk interface ini
        obj="{"
        obj+="\"interface\": \"$interface\","
        obj+="\"used_bandwidth\": $used_bandwidth"
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
}

# Jalankan fungsi
parse_net_dev
