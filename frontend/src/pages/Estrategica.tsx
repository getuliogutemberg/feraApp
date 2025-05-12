import {
  Box,
  Typography,
  TextField,
  Button,
  Chip,
  Card,
  IconButton,
  FormControlLabel,
  Modal,
  FormControl,
  RadioGroup,
  Radio,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import ReplayIcon from "@mui/icons-material/Replay";
import CustomSwitch from "../components/CustomSwitch";
import { useState, useEffect } from "react";
import axios from "axios";
import CRITERIOS_PADRAO from "../components/CriteriosPadrao";

interface Grupo {
  id: string; // id da API
  cod_grupo: number; // cod_grupo da API
  desc_grupo: string; // desc_grupo da API
}

interface Item {
  id: string; // Identificador único do item
  cod_item_material: number; // Código do item
  cod_itemmaterial_ext: number; // Código externo do item
  desc_material: string; // Descrição do item
  desc_numero_itemmaterial: number; // Número do item
  cod_unidade_medida: string; // Código da unidade de medida
  cod_classematerial: number; // Código da classe material
  tag: string; //
}

type Opcao = { cod_opcao: string | number; desc_opcao: string };


interface ParametroResponse {
  cod_grupo: number;
  cod_item_material: number;
  cods_parametro: number[];
  cods_opcao: (string | number)[];
}
type CriterioComResposta = {
  cod_parametro: number;
  var_name: string;
  desc_parametro: string;
  tipo: string;
  opcoes: Opcao[];
  resposta?: string | boolean | number;
};

export default function TelaEstrategica() {
  const [buscaItem, setBuscaItem] = useState<string>("");
  const [buscaGrupo, setBuscaGrupo] = useState("");
  const [grupoSelecionado, setGrupoSelecionado] = useState<Grupo | null>(null);
  const [itemSelecionado, setItemSelecionado] = useState<Item | null>(null);
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [itens, setItens] = useState<Item[]>([]); // Para armazenar todos os itens
  const [modalOpen, setModalOpen] = useState(false); // Estado para controlar o modal
  const [onlyMatchingGroup, setOnlyMatchingGroup] = useState(false);
  const [filtroSelecionado, setFiltroSelecionado] = useState<
    "Todos" | "Não preenchidos" | "Preenchidos"
  >("Todos");
  const [filtroItemSelecionado, setFiltroItemSelecionado] =
    useState<string>("Todos");

  // Estado para os critérios
  const criterios = CRITERIOS_PADRAO;
  const [criteriosGrupo, setCriteriosGrupo] =
    useState<CriterioComResposta[]>(CRITERIOS_PADRAO);
  const [criteriosItem, setCriteriosItem] =
    useState<CriterioComResposta[]>(CRITERIOS_PADRAO);
  const [criteriosSelecionados, setCriteriosSelecionados] = useState<
    Record<number, number>
  >({});
  const [criteriosItemSelecionados, setCriteriosItemSelecionados] = useState<
    Record<number, number>
  >({});

  // Adicione este estado para controlar a visibilidade dos parâmetros
  const [showParametros, setShowParametros] = useState(false);

  const mapRespostaComCriterios = (
    dadosApi: ParametroResponse
  ): CriterioComResposta[] => {
    return CRITERIOS_PADRAO.map((criterioBase) => {
      const index = dadosApi.cods_parametro.indexOf(criterioBase.cod_parametro);
      const resposta = index !== -1 ? dadosApi.cods_opcao[index] : undefined;

      return {
        ...criterioBase,
        resposta,
      };
    });
  };

  const gruposFiltrados = grupos.filter((grupo) => {
    const matchBusca =
      grupo.cod_grupo.toString().includes(buscaGrupo) ||
      grupo.desc_grupo.toLowerCase().includes(buscaGrupo.toLowerCase());
    if (filtroSelecionado === "Todos") return matchBusca;

    const preenchido = criterios.some(
      (c) =>
        c.resposta !== undefined && c.resposta !== null && c.resposta !== ""
    );
    return (
      matchBusca &&
      (filtroSelecionado === "Preenchidos" ? preenchido : !preenchido)
    );
  });

  const itensFiltradosComBusca = itens.filter((item) => {
    const query = buscaItem.toLowerCase();
    return (
      item.desc_material.toLowerCase().includes(query) ||
      item.cod_item_material.toString().includes(query)
    );
  });

  // Função para restaurar os padrões
  const handleRestoreDefault = async () => {
    const id = itemSelecionado?.cod_item_material;

    const response = await axios.put(
      `http://localhost:5000/params/reset/material/${id}`
    );

    console.log(response);
  };

  const saveGroupParams = async (
    cod_grupo: number,
    data: Record<number, number>
  ) => {
    try {
      console.log(data);
      const cods_parametro = Object.keys(data);
      const cods_opcao = Object.values(data);

      const response = await axios.put(
        `http://localhost:5000/params/group/${cod_grupo}`,
        {
          cods_parametro,
          cods_opcao,
          client: "default",
          data_estrategia: new Date(),
          onlyMatchingGroupParams: onlyMatchingGroup
        }
      );

      console.log("Parâmetros salvos com sucesso:", response.data);

      // // Re-fetch items for the selected group to update their criteria
      if (grupoSelecionado) {
        const itensResponse = await axios.get(
          `http://localhost:5000/materials/${grupoSelecionado.cod_grupo}`
        );
        setItens(itensResponse.data);
      }
    } catch (error) {
      console.error("Erro ao salvar parâmetros:", error);
    }
  };

  // Função para abrir o modal com os detalhes do item selecionado
  const handleEditClick = (item: Item) => {
    setItemSelecionado(item);
    setModalOpen(true);
  };

  // Função para fechar o modal
  const handleCloseModal = () => {
    setModalOpen(false);
    setItemSelecionado(null);
  };

  // Função similar para salvar parâmetros de material
  const handleSaveMaterialParams = async () => {
    try {
      if (!itemSelecionado) return;

      const cods_parametro = Object.keys(criteriosItemSelecionados).map(Number);
      const cods_opcao = Object.values(criteriosItemSelecionados);

      const response = await axios.put(
        `http://localhost:5000/params/material/${itemSelecionado.cod_item_material}`,
        {
          cods_parametro,
          cods_opcao,
          client: "default", // Ajuste conforme necessário
          data_estrategia: new Date(),
        }
      );

      if (response.status === 200) {
        setModalOpen(false);
        // alert("Parâmetros do item salvos com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao salvar parâmetros do item:", error);
      alert("Erro ao salvar parâmetros do item");
    }
  };

  // Adicione esta função para resetar os parâmetros
  const handleResetParams = async () => {
    try {
      if (!grupoSelecionado) {
        alert("Selecione um grupo primeiro");
        return;
      }

      const id = grupoSelecionado.cod_grupo;

      await axios.put(
        `http://localhost:5000/params/reset/group/${id}`
      );

      // if (response.status === 200) {
      //   // Atualiza os critérios selecionados com os valores padrão
      //   const novosCriterios: Record<number, number> = {};
      //   // response.data.estrategia.cods_parametro.forEach(
      //   //   (cod: number, index: number) => {
      //   //     novosCriterios[cod] = response.data.estrategia.cods_opcao[index];
      //   //   }
      //   // );
      //   setCriteriosSelecionados(novosCriterios);

        // alert("Parâmetros restaurados com sucesso!");
      
    } catch (error) {
      console.error("Erro ao restaurar parâmetros:", error);
      alert("Erro ao restaurar parâmetros");
    }
  };

  // Carregar grupos ao montar a página
  useEffect(() => {
    axios
      .get("http://localhost:5000/groupDictionary")
      .then((response) => {
        setGrupos(response.data); // Carrega os grupos
      })
      .catch((error) => console.error("Erro ao buscar grupos:", error));
  }, []);

  // Carregar os itens apenas quando o grupo for selecionado
  useEffect(() => {
    if (grupoSelecionado) {
      axios
        .get(`http://localhost:5000/materials/${grupoSelecionado.cod_grupo}`)
        .then((response) => setItens(response.data))
        .catch((error) => console.error("Erro ao buscar itens:", error));

      axios
        .get(`http://localhost:5000/params/group/${grupoSelecionado.cod_grupo}`)
        .then((response) => {
          const criteriosComRespostas = mapRespostaComCriterios(response.data);
          setCriteriosGrupo(criteriosComRespostas);

          // Initialize criteriosSelecionados with API values
          const selecionados: Record<number, number> = {};
          criteriosComRespostas.forEach((criterio) => {
            if (criterio.resposta !== undefined) {
              selecionados[criterio.cod_parametro] = Number(criterio.resposta);
            }
          });
          setCriteriosSelecionados(selecionados);
        })
        .catch((error) => console.error("Erro ao buscar itens:", error));
    }
  }, [grupoSelecionado]);

  useEffect(() => {
    if (itemSelecionado) {
      axios
        .get(
          `http://localhost:5000/params/material/${itemSelecionado.cod_item_material}`
        )
        .then((response) => {
          const criteriosComRespostas = mapRespostaComCriterios(response.data);
          setCriteriosItem(criteriosComRespostas);

          // Initialize criteriosItemSelecionados with API values
          const selecionados: Record<number, number> = {};
          criteriosComRespostas.forEach((criterio) => {
            if (criterio.resposta !== undefined) {
              selecionados[criterio.cod_parametro] = Number(criterio.resposta);
            }
          });
          setCriteriosItemSelecionados(selecionados);
        })
        .catch((error) => console.error("Erro ao buscar itens:", error));
    }
  }, [itemSelecionado]);

  return (
    <Box
      sx={{
        position: "fixed",
        top: "62px",
        left: "80px",
        display: "flex",
        gap: 2,
        background: "#0A1C44",
        height: "calc(100vh - 93px)",
        padding: 2,
        width: "calc(100vw - 110px)",
      }}
    >
      {/* Grupos */}
      <Card sx={{ flex: 1, background: "#1F2A4C", padding: 2 }}>
        <Typography variant="h6" sx={{ color: "#F7F7F7" }}>
          Grupos
        </Typography>
        <TextField
          fullWidth
          placeholder="Busque um código ou nome"
          variant="outlined"
          size="small"
          sx={{ background: "#fff", borderRadius: "0.4rem", marginTop: 2 }}
          InputProps={{ endAdornment: <SearchIcon /> }}
          onChange={(e) => setBuscaGrupo(e.target.value)}
        />

        {/* Filtros */}
        <Box sx={{ display: "flex", gap: 1, marginY: 2 }}>
          {["Todos", "Não preenchidos", "Preenchidos"].map((filtro) => (
            <Chip
              key={filtro}
              label={filtro}
              onClick={() =>
                setFiltroSelecionado(
                  filtro as "Todos" | "Não preenchidos" | "Preenchidos"
                )
              }
              sx={{
                background:
                  filtroSelecionado === filtro
                    ? "rgba(49, 131, 207, 1)"
                    : "rgba(213, 226, 238, 1)",
                color: filtroSelecionado === filtro ? "#fff" : "#000",
                paddingX: "20px",
                height: "100%",
                cursor: "pointer",
              }}
            />
          ))}
        </Box>
        <Box
          sx={{
            height: "calc(100vh - 260px)",
            overflowY: "auto",
            paddingRight: "5px",
          }}
        >
          {gruposFiltrados.map((grupo, index) => (
            <Card
              key={index}
              sx={{
                background:
                  grupoSelecionado?.cod_grupo === grupo.cod_grupo
                    ? "rgba(49, 131, 207, 1)"
                    : "rgba(36, 75, 127, 1)",
                marginBottom: 1,
                padding: 1,
                color: "#fff",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "start",
              }}
              onClick={() => {
                setGrupoSelecionado(grupo);
                setShowParametros(true);
              }}
            >
              <Typography variant="body1" sx={{}}>
                {grupo.cod_grupo.toString().padStart(3, "0")} -{" "}
                {grupo.desc_grupo}
              </Typography>
              <Typography variant="caption">
                Última atualização: 26/07/2024
              </Typography>
            </Card>
          ))}
        </Box>
      </Card>

      {/* Itens */}
      <Card sx={{ flex: 1, background: "#1F2A4C", padding: 2 }}>
        <Typography variant="h6" sx={{ color: "#F7F7F7" }}>
          Itens
        </Typography>
        <TextField
          onChange={(e) => setBuscaItem(e.target.value)}
          fullWidth
          placeholder="Busque um código ou nome"
          variant="outlined"
          size="small"
          sx={{ background: "#fff", borderRadius: "0.4rem", marginTop: 2 }}
          InputProps={{ endAdornment: <SearchIcon /> }}
        />
        <Box sx={{ display: "flex", gap: 1, marginY: 2, flexWrap: "wrap" }}>
          {["Todos", "Cadastro Padrão", "Editados", "Estratégicos"].map(
            (filtro) => (
              <Chip
                key={filtro}
                label={filtro}
                onClick={() => setFiltroItemSelecionado(filtro)}
                sx={{
                  background:
                    filtroItemSelecionado === filtro
                      ? "rgba(49, 131, 207, 1)"
                      : "rgba(213, 226, 238, 1)",
                  color: filtroItemSelecionado === filtro ? "#fff" : "#000",
                  paddingX: "20px",
                  height: "100%",
                  cursor: "pointer",
                }}
              />
            )
          )}
        </Box>
        <Box sx={{ display: "flex", gap: 2, marginBottom: 2 }}>
          <Button
            variant="contained"
            sx={{
              background: "rgba(46, 112, 171, 1)",
              whiteSpace: "nowrap",
              paddingX: "50px",
            }}
            startIcon={<ReplayIcon />}
            onClick={handleResetParams}
          >
            Restaurar padrão
          </Button>
          <span style={{ color: "white" }}>
            Restaura todos os itens para o padrão do grupo. 
          </span>
        </Box>

        <Box
          sx={{
            height: "calc(100vh - 330px)",
            overflowY: "auto",
            paddingRight: "5px",
          }}
        >
          {itensFiltradosComBusca.map((item, index) => (
            <Card
              key={index}
              onDoubleClick={() => handleEditClick(item)}
              onClick={() => {
                console.log(item);
                // setItemSelecionado(item);
              }}
              sx={{
                background:
                  itemSelecionado?.cod_item_material === item.cod_item_material
                    ? "rgba(49, 131, 207, 1)"
                    : "rgba(36, 75, 127, 1)",
                marginY: 1,
                padding: 1,
                color: "#fff",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <Box
                sx={{ display: "flex", flexDirection: "column", width: "100%" }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <Typography>{item.desc_material}</Typography>
                  {item.tag && (
                    <Chip
                      label={item.tag}
                      sx={{
                        background: "rgba(249, 245, 147, 1)",
                        paddingX: "20px",
                        height: "100%",
                      }}
                    />
                  )}
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <Typography variant="caption" sx={{ whiteSpace: "nowrap" }}>
                    Última atualização: 26/07/2024
                  </Typography>
                  <Box sx={{ display: "flex", marginLeft: "auto" }}>
                    <IconButton color="inherit">
                      <ReplayIcon />
                    </IconButton>
                    <IconButton
                      color="inherit"
                      onClick={() => handleEditClick(item)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            </Card>
          ))}
        </Box>
      </Card>

      {/* Critérios Padrão */}
      <Card
        sx={{
          flex: 1,
          background: "#1F2A4C",
          padding: 2,
          display: showParametros ? "block" : "block",
        }}
      >
        <Typography variant="h6" sx={{ color: "#F7F7F7", marginBottom: 3 }}>
          {"Critérios Padrão do Grupo"}
        </Typography>
        <Box
          sx={{
            height: "calc(100vh - 280px)",
            overflowY: "auto",
            paddingRight: "5px",
          }}
        >
          {showParametros &&
            criteriosGrupo.slice(0, -1).map((criterio) => (
              <Box key={criterio.cod_parametro} sx={{ marginTop: 1 }}>
                {criterio.tipo === "boolean" ? (
                  <FormControlLabel
                    sx={{ color: "white", m: 1, gap: 2 }}
                    control={
                      <CustomSwitch
                        checked={
                          criteriosSelecionados[criterio.cod_parametro] === 1
                        }
                        onChange={(e) => {
                          setCriteriosSelecionados((prev) => ({
                            ...prev,
                            [criterio.cod_parametro]: e.target.checked ? 1 : 0,
                          }));
                        }}
                      />
                    }
                    label={
                      <Typography sx={{ color: "white", marginBottom: 1 }}>
                        {criterio.desc_parametro}
                      </Typography>
                    }
                  />
                ) : (
                  <>
                    <Typography sx={{ color: "white", marginBottom: 1 }}>
                      {criterio.desc_parametro}
                    </Typography>

                    <FormControl>
                      <RadioGroup
                        row
                        value={
                          criteriosSelecionados[criterio.cod_parametro] ?? ""
                        }
                        onChange={(e) => {
                          setCriteriosSelecionados((prev) => ({
                            ...prev,
                            [criterio.cod_parametro]: parseInt(e.target.value),
                          }));
                        }}
                      >
                        {criterio.opcoes.map((opcao) => {
                          // console.log(opcao)

                          return (
                            <FormControlLabel
                              key={opcao.cod_opcao}
                              value={opcao.cod_opcao}
                              control={
                                <Radio
                                  sx={{
                                    color: "rgba(36, 75, 127, 1)",
                                    "&.Mui-checked": {
                                      color: "rgba(49, 131, 207, 1)",
                                    },
                                  }}
                                />
                              }
                              label={opcao.desc_opcao}
                              sx={{ color: "white" }}
                            />
                          );
                        })}
                      </RadioGroup>
                    </FormControl>
                  </>
                )}
              </Box>
            ))}
        </Box>

        <Box
          sx={{
            display: showParametros ? "flex" : "flex",
            flexDirection: "column",
            alignItems: "end",
            gap: 2,
          }}
        >
          {
            <>
              <Button
                variant="contained"
                sx={{ marginTop: 2, background: "rgba(46, 112, 171, 1)" }}
                onClick={() =>
                  grupoSelecionado &&
                  saveGroupParams(
                    grupoSelecionado.cod_grupo,
                    criteriosSelecionados
                  )
                }
              >
                Aplicar a todos os itens
              </Button>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "baseline",
                  gap: 2,
                }}
              >
                <Typography sx={{ color: "white" }}>
                  Exceto itens editados manualmente
                </Typography>
                <FormControlLabel
                  sx={{ color: "white" }}
                  control={
                    <CustomSwitch 
                      sx={{ m: 1 }} 
                      checked={onlyMatchingGroup}
                      onChange={(event) => setOnlyMatchingGroup(event.target.checked)}
                    />
                  }
                  label=""
                />
              </Box>
            </>
          }
        </Box>
      </Card>

      {/* Modal de Edição */}
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box
          sx={{
            padding: 2,
            background: "#1F2A4C",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",

            borderRadius: "8px",
            boxShadow: 3,
          }}
        >
          {itemSelecionado && (
            <Box sx={{ marginBottom: 5 }}>
              <Typography
                variant="h6"
                sx={{ color: "#F7F7F7", marginBottom: 3 }}
              >
                Critérios Item
              </Typography>

              <Typography>{itemSelecionado.desc_material}</Typography>
              <Typography variant="caption">
                {/* Última atualização: 26/07/2024 */}
              </Typography>
            </Box>
          )}

          {criteriosItem.map((criterio) => (
            <Box key={criterio.cod_parametro} sx={{ marginTop: 1 }}>
              {criterio.tipo === "boolean" ? (
                <FormControlLabel
                  sx={{ color: "white", m: 1, gap: 2 }}
                  control={
                    <CustomSwitch
                      checked={
                        criteriosItemSelecionados[criterio.cod_parametro] === 1
                      }
                      onChange={(e) => {
                        setCriteriosItemSelecionados((prev) => ({
                          ...prev,
                          [criterio.cod_parametro]: e.target.checked ? 1 : 0,
                        }));
                      }}
                    />
                  }
                  label={
                    <Typography sx={{ color: "white", marginBottom: 1 }}>
                      {criterio.desc_parametro}
                    </Typography>
                  }
                />
              ) : (
                <>
                  <Typography sx={{ color: "white", marginBottom: 1 }}>
                    {criterio.desc_parametro}
                  </Typography>
                  <FormControl>
                    <RadioGroup
                      row
                      value={
                        criteriosItemSelecionados[criterio.cod_parametro] ?? ""
                      }
                      onChange={(e) => {
                        setCriteriosItemSelecionados((prev) => ({
                          ...prev,
                          [criterio.cod_parametro]: parseInt(e.target.value),
                        }));
                      }}
                    >
                      {criterio.opcoes.map((opcao) => (
                        <FormControlLabel
                          key={opcao.cod_opcao}
                          value={opcao.cod_opcao}
                          control={
                            <Radio
                              sx={{
                                color: "rgba(36, 75, 127, 1)",
                                "&.Mui-checked": {
                                  color: "rgba(49, 131, 207, 1)",
                                },
                              }}
                            />
                          }
                          label={opcao.desc_opcao}
                          sx={{ color: "white" }}
                        />
                      ))}
                    </RadioGroup>
                  </FormControl>
                </>
              )}
            </Box>
          ))}

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Button
              variant="contained"
              sx={{ marginTop: 2, background: "rgba(46, 112, 171, 1)" }}
              startIcon={<ReplayIcon />}
              onClick={handleRestoreDefault} // Restaurar padrão
            >
              Restaurar padrão
            </Button>
            <Button
              variant="contained"
              sx={{ marginTop: 2, background: "rgba(46, 112, 171, 1)" }}
              onClick={handleSaveMaterialParams} // Aplicar mudanças
            >
              Aplicar
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
