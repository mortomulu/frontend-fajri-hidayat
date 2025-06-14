import { useEffect, useState } from "react";
import axios from "axios";

interface Negara {
  id_negara: number;
  nama_negara: string;
  kode_negara: string;
}

interface Pelabuhan {
  id_pelabuhan: string;
  nama_pelabuhan: string;
  id_negara: string;
}

interface Barang {
  id_barang: number;
  nama_barang: string;
  id_pelabuhan: number;
  description: string;
  diskon: number;
  harga: number;
}

export default function DropdownPage() {
  const [negaras, setNegaras] = useState<Negara[]>([]);
  const [pelabuhans, setPelabuhans] = useState<Pelabuhan[]>([]);
  const [barangs, setBarangs] = useState<Barang[]>([]);

  const [selectedNegara, setSelectedNegara] = useState<number | null>(null);
  const [selectedPelabuhan, setSelectedPelabuhan] = useState<number | null>(
    null
  );
  const [selectedBarang, setSelectedBarang] = useState<Barang | null>(null);

  const [formBarang, setFormBarang] = useState<Barang | null>(null);

  useEffect(() => {
    setFormBarang(selectedBarang);
  }, [selectedBarang]);

  useEffect(() => {
    axios
      .get("http://202.157.176.100:3001/negaras")
      .then((res) => {
        setNegaras(res.data);
        const indonesia = res.data.find((n: Negara) => n.id_negara === 7);
        if (indonesia) setSelectedNegara(indonesia.id_negara);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (selectedNegara !== null) {
      axios
        .get(
          `http://202.157.176.100:3001/pelabuhans?filter=${encodeURIComponent(
            JSON.stringify({ where: { id_negara: selectedNegara } })
          )}`
        )
        .then((res) => {
          setPelabuhans(res.data);
          const pelabuhan = res.data.find(
            (p: Pelabuhan) => p.id_pelabuhan === "7"
          );
          if (pelabuhan) {
            setSelectedPelabuhan(pelabuhan.id_pelabuhan);
          } else {
            setSelectedPelabuhan(res.data[0].id_pelabuhan);
          }
          setSelectedBarang(null);
          setFormBarang(null);
          setBarangs([]);
        })
        .catch((err) => console.error(err));
    }
  }, [selectedNegara]);

  useEffect(() => {
    if (selectedPelabuhan !== null) {
      axios
        .get(
          `http://202.157.176.100:3001/barangs?filter=${encodeURIComponent(
            JSON.stringify({ where: { id_pelabuhan: selectedPelabuhan } })
          )}`
        )
        .then((res) => {
          setBarangs(res.data);
          const barang = res.data.find((b: Barang) => b.id_barang === 11);
          if (barang) {
            setSelectedBarang(barang);
            setFormBarang(barang);
          } else {
            setSelectedBarang(res.data[0]);
            setFormBarang(res.data[0]);
          }
        })
        .catch((err) => console.error(err));
    }
  }, [selectedPelabuhan]);

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold mb-4">Dropdown Selector</h1>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Pilih Negara</label>
        <select
          className="border p-2 rounded w-full"
          value={selectedNegara ?? ""}
          onChange={(e) => setSelectedNegara(Number(e.target.value))}
        >
          <option value="" disabled>
            Pilih Negara
          </option>
          {negaras.map((negara) => (
            <option key={negara.id_negara} value={negara.id_negara}>
              {negara.kode_negara} - {negara.nama_negara}
            </option>
          ))}
        </select>
      </div>

      {pelabuhans?.length > 0 && (
        <div className="mb-4">
          <label className="block mb-1 font-medium">Pilih Pelabuhan</label>
          <select
            className="border p-2 rounded w-full"
            value={selectedPelabuhan ?? ""}
            onChange={(e) => setSelectedPelabuhan(Number(e.target.value))}
          >
            <option value="" disabled>
              Pilih Pelabuhan
            </option>
            {pelabuhans.map((p) => (
              <option key={p.id_pelabuhan} value={p.id_pelabuhan}>
                {p.nama_pelabuhan}
              </option>
            ))}
          </select>
        </div>
      )}

      {barangs.length > 0 && (
        <div className="mb-4">
          <label className="block mb-1 font-medium">Pilih Barang</label>
          <select
            className="border p-2 rounded w-full"
            value={selectedBarang ? JSON.stringify(selectedBarang) : ""}
            onChange={(e) => {
              const value = e.target.value;
              setSelectedBarang(value ? JSON.parse(value) : null);
            }}
          >
            <option value="" disabled>
              Pilih Barang
            </option>

            {barangs.map((b) => (
              <option key={b.id_barang} value={JSON.stringify(b)}>
                {b.id_barang} - {b.nama_barang}
              </option>
            ))}
          </select>
        </div>
      )}
      {formBarang && (
        <div className="mt-6 p-4 border rounded bg-gray-100 space-y-4">
          <div>
            <label className="block font-medium mb-1">Deskripsi</label>
            <textarea
              className="w-full border rounded p-2"
              value={formBarang.description}
              readOnly
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Diskon (%)</label>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                className="w-full border rounded p-2"
                value={formBarang.diskon}
                onChange={(e) =>
                  setFormBarang({
                    ...formBarang,
                    diskon: Number(e.target.value),
                  })
                }
              />
              %
            </div>
          </div>

          <div>
            <label className="block font-medium mb-1">Harga (Rp)</label>
            <input
              type="number"
              className="w-full border rounded p-2"
              value={formBarang.harga}
              onChange={(e) =>
                setFormBarang({ ...formBarang, harga: Number(e.target.value) })
              }
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Total Harga</label>
            <input
              type="number"
              className="w-full border rounded p-2 bg-gray-200"
              value={(formBarang.harga * (1 - formBarang.diskon / 100)).toFixed(
                0
              )}
              readOnly
            />
          </div>
        </div>
      )}
    </div>
  );
}
