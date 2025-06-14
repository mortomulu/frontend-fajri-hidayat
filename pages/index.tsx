import { useEffect, useState } from "react";
import axios from "axios";
import {
  Layout,
  Menu,
  Select,
  Input,
  Form,
  Typography,
  Divider,
  Button,
  Modal,
  message,
} from "antd";
import {
  AppstoreOutlined,
  DatabaseOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import { formatRupiah, parseRupiah } from "@/helpers/formatIdr";

const { Option } = Select;
const { Title } = Typography;
const { Sider, Content } = Layout;

interface Negara {
  id_negara: number;
  nama_negara: string;
  kode_negara: string;
}

interface Pelabuhan {
  id_pelabuhan: string | number;
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

  const handlePreview = () => {
    Modal.info({
      title: "Preview Informasi Barang",
      width: 600,
      content: renderPreviewContent(),
      onOk() {},
    });
  };

  const renderPreviewContent = () => {
    if (!formBarang) return <p>Data belum lengkap.</p>;

    return (
      <div className="space-y-2 pt-2">
        <p>
          <strong>Negara:</strong>{" "}
          {negaras.find((n) => n.id_negara === selectedNegara)?.nama_negara}
        </p>
        <p>
          <strong>Pelabuhan:</strong>{" "}
          {
            pelabuhans.find((p) => p.id_pelabuhan === selectedPelabuhan)
              ?.nama_pelabuhan
          }
        </p>
        <p>
          <strong>Barang:</strong> {formBarang.nama_barang}
        </p>
        <p>
          <strong>Deskripsi:</strong> {formBarang.description}
        </p>
        <p>
          <strong>Harga:</strong> {formatRupiah(formBarang.harga)}
        </p>
        <p>
          <strong>Diskon:</strong> {formBarang.diskon}%
        </p>
        <p>
          <strong>Total Harga:</strong>{" "}
          {new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
          }).format(formBarang.harga * (1 - formBarang.diskon / 100))}
        </p>
      </div>
    );
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        width={220}
        style={{ background: "#fff", borderRight: "1px solid #f0f0f0" }}
      >
        <div className="flex items-center justify-center gap-2 px-4 py-5 border-b border-gray-200">
          <img src="/pelindo.png" alt="Logo" className="w-40" />
        </div>

        <Menu
          mode="inline"
          defaultSelectedKeys={["1"]}
          style={{ borderRight: "none" }}
          className="px-2 pt-4"
        >
          <Menu.Item key="1" icon={<AppstoreOutlined />} className="rounded-md">
            Home
          </Menu.Item>
        </Menu>
      </Sider>

      <Layout>
        <Content
          style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}
        >
          <Title level={3}>Formulir Informasi Barang</Title>

          <Form layout="vertical">
            <Form.Item label="Pilih Negara">
              <Select
                showSearch
                placeholder="Pilih Negara"
                optionFilterProp="children"
                onChange={(value) => setSelectedNegara(value)}
                value={selectedNegara || undefined}
                filterOption={(input, option) =>
                  (option?.children as unknown as string)
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              >
                {negaras.map((n) => (
                  <Option key={n.id_negara} value={n.id_negara}>
                    {n.kode_negara} - {n.nama_negara}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="Pilih Pelabuhan">
              <Select
                showSearch
                placeholder="Pilih Pelabuhan"
                optionFilterProp="children"
                onChange={(value) => setSelectedPelabuhan(value)}
                value={selectedPelabuhan || undefined}
                filterOption={(input, option) =>
                  (option?.children as unknown as string)
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              >
                {pelabuhans.map((p) => (
                  <Option key={p.id_pelabuhan} value={p.id_pelabuhan}>
                    {p.nama_pelabuhan}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="Pilih Barang">
              <Select
                showSearch
                placeholder="Pilih Barang"
                optionFilterProp="children"
                onChange={(value) => {
                  const found = barangs.find(
                    (b) => b.id_barang === Number(value)
                  );
                  setSelectedBarang(found || null);
                }}
                value={selectedBarang?.id_barang || undefined}
                filterOption={(input, option) =>
                  (option?.children as unknown as string)
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              >
                {barangs.map((b) => (
                  <Option key={b.id_barang} value={b.id_barang}>
                    {b.id_barang} - {b.nama_barang}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {formBarang && (
              <>
                <Divider />
                <Form.Item label="Deskripsi">
                  <Input.TextArea value={formBarang.description} readOnly />
                </Form.Item>
                <Form.Item label="Diskon (%)">
                  <div className="flex gap-2 items-center">
                    <Input
                      className="w-24"
                      type="number"
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
                </Form.Item>
                <Form.Item label="Harga (Rp)">
                  <Input
                    value={formatRupiah(formBarang.harga)}
                    onChange={(e) =>
                      setFormBarang({
                        ...formBarang,
                        harga: parseRupiah(e.target.value),
                      })
                    }
                  />
                </Form.Item>
                <Form.Item label="Total Harga">
                  <Input
                    value={formatRupiah(
                      formBarang.harga * (1 - formBarang.diskon / 100)
                    )}
                    readOnly
                  />
                </Form.Item>
                <Form.Item>
                  <div className="flex gap-2 justify-end">
                    <Button onClick={handlePreview}>Preview</Button>
                    <Button
                      type="primary"
                      onClick={() => message.success("Berhasil submit!")}
                    >
                      Submit
                    </Button>
                  </div>
                </Form.Item>
              </>
            )}
          </Form>
        </Content>
      </Layout>
    </Layout>
  );
}
