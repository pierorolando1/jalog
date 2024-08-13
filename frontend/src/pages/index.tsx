import ProtectedLayout from "@/layouts/protected";
import { useUser } from "@/stores/stores";

import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue } from "@nextui-org/table";
import { Chip } from "@nextui-org/chip"
import { Button } from "@nextui-org/button";
import { Spinner } from "@nextui-org/spinner";
import { apiUrl } from "@/config/site";
import { useEffect, useState } from "react";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/modal";
import { Input } from "@nextui-org/input";

export default function IndexPage() {

  const [useCurrAccount, setuseCurrAccount] = useState({
    account: "",
    balance: null,
    isOpenModal: false,
    transactions: []
  });



  // Estados para manejar el nuevo modal de transacción
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [transactionData, setTransactionData] = useState({
    idCuentaDestino: "",
    monto: "",
  });
  const [isSubmittingTransaction, setIsSubmittingTransaction] = useState(false);
  const [transactionSubmitResult, setTransactionSubmitResult] = useState<any>(null);

    // Función para realizar la transacción
    const handleTransactionSubmit = async () => {
      setIsSubmittingTransaction(true);
      try {
        const response = await fetch(apiUrl + "api/addTransaction", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            idTransaccion: Date.now().toString(),
            idCuentaOrigen: useCurrAccount.account,
            idCuentaDestino: transactionData.idCuentaDestino,
            monto: parseFloat(transactionData.monto),
          }),
        });
        const result = await response.text();
        setTransactionSubmitResult(result);
        if (result === "Transacción añadida con éxito") {
          setuseCurrAccount((prev: any) => ({
            ...prev,
            transactions: [...prev.transactions, {
              id: Date.now().toString(),
              origen: useCurrAccount.account,
              destino: transactionData.idCuentaDestino,
              monto: transactionData.monto,
              beneficioso: false, // Asume que es un retiro de la cuenta actual
            }],
          }));
        }
      } catch (error) {
        console.error(error);
        setTransactionSubmitResult("Error al añadir transacción");
      } finally {
        setIsSubmittingTransaction(false);
      }
    };



  const [loans, setLoans] = useState([]);
  const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);
  const [loanViability, setLoanViability] = useState<any>(null);
  const [isCheckingViability, setIsCheckingViability] = useState(false);
  const [loanAmount, setLoanAmount] = useState("");
  const [isSubmittingLoan, setIsSubmittingLoan] = useState(false);
  const [loanSubmitResult, setLoanSubmitResult] = useState<any>(null);

  const { user } = useUser();

  useEffect(() => {
    getAccounts();
    getLoans();
  }, [user]);

  const [accounts, setaccounts] = useState([]);

  const getAccounts = async () => {
    try {
      const response = await fetch(apiUrl + "api/getAccounts?dni=" + user?.dni);
      const data = await response.json();
      setaccounts(data);
    } catch (error) {
      console.error(error);
    }
  };

  const getLoans = async () => {
    try {
      const response = await fetch(apiUrl + "api/getLoans?dni=" + user?.dni);
      const data = await response.json();
      setLoans(data);
    } catch (error) {
      console.error(error);
    }
  };

  const checkLoanViability = async () => {
    setIsCheckingViability(true);
    try {
      const response = await fetch(apiUrl + "api/evaluateLoan?dni=" + user?.dni);
      const data = await response.json();
      setLoanViability(data.viabilidad);
    } catch (error) {
      console.error(error);
      setLoanViability("error");
    } finally {
      setIsCheckingViability(false);
      setIsLoanModalOpen(true);
    }
  };

  const requestNewLoan = async () => {
    setIsSubmittingLoan(true);
    try {
      const response = await fetch(apiUrl + "api/addLoan", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idPrestamo: Date.now().toString(), // Generate a unique ID
          dni: user?.dni,
          estado: "al_dia", // Assuming new loans start with "al_dia" status
          monto: loanAmount
        }),
      });
      const result = await response.text();
      setLoanSubmitResult(result);
      if (result === "Préstamo añadido con éxito") {
        getLoans(); // Refresh the loans list
      }
    } catch (error) {
      console.error(error);
      setLoanSubmitResult("Error al añadir préstamo");
    } finally {
      setIsSubmittingLoan(false);
    }
  };

  const rows = accounts.map((account) => {
    return {
      key: account,
      name: account,
      status: "Active"
    }
  })

  const columns = [
    {
      key: "name",
      label: "NRO CUENTA",
    },

    {
      key: "status",
      label: "STATUS",
    },
    {
      key: "details",
      label: "ACTIONS",
    }
  ];



  return (
    <ProtectedLayout>
      <Modal isOpen={useCurrAccount.isOpenModal}
        backdrop="blur" scrollBehavior="inside" hideCloseButton
        onClose={
          () => setuseCurrAccount({
            account: "",
            balance: null,
            isOpenModal: false,
            transactions: []
          })
        }
      >
        <ModalContent className="py-8">
          <ModalBody>

            <h1 className="font-bold">Account: {useCurrAccount.account}</h1>
            {
              useCurrAccount.balance !== null ?
                <h1 className="font-bold">Balance: {useCurrAccount.balance}</h1>
                :
                <Button
                  color="primary"
                  variant="flat"
                  onClick={async () => {
                    try {
                      const response = await fetch(apiUrl + "api/getAccountBalance?idCuenta=" + useCurrAccount.account)
                      const data = await response.json()
                      setuseCurrAccount({
                        ...useCurrAccount,
                        balance: data.balance
                      })
                    } catch (error) {
                      console.error(error)
                    }
                  }}
                >Get Balance</Button>
            }
                        <Button
              color="secondary"
              variant="flat"
              onClick={() => setIsTransactionModalOpen(true)}
            >
              Realizar Transacción
            </Button>
            {

              (useCurrAccount.transactions?.length > 0) ?
                <Table removeWrapper>
                  <TableHeader>
                    <TableColumn>FROM</TableColumn>
                    <TableColumn>TO</TableColumn>
                    <TableColumn>AMOUNT</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {
                      useCurrAccount.transactions?.map((transaction: any) => {
                        console.log(transaction)
                        return (
                          <TableRow key={transaction.id + ''}>
                            <TableCell>{transaction.origen + ''}</TableCell>
                            <TableCell>{transaction.destino + ''}</TableCell>
                            <TableCell>{
                              transaction.beneficioso ? <h1 className="text-green-500">+{transaction.monto}</h1> : <h1 className="text-red-500">- {transaction.monto}</h1>
                            }</TableCell>
                          </TableRow>
                        )
                      }).reverse()
                    }
                  </TableBody>
                </Table>
                :
                // button loading
                <Button
                  color="primary"
                  variant="light"
                  disabled
                >
                  <Spinner size="sm" />
                  Loading
                </Button>

            }


          </ModalBody>
        </ModalContent>
      </Modal>


      {/* Modal para realizar la transacción */}
      <Modal isOpen={isTransactionModalOpen} onClose={() => setIsTransactionModalOpen(false)}>
        <ModalContent>
          <ModalHeader>Realizar Transacción</ModalHeader>
          <ModalBody>
            <Input
              type="text"
              label="Cuenta Destino"
              placeholder="Ingrese la cuenta destino"
              value={transactionData.idCuentaDestino}
              onChange={(e) => setTransactionData({ ...transactionData, idCuentaDestino: e.target.value })}
            />
            <Input
              type="number"
              label="Monto"
              placeholder="Ingrese el monto"
              value={transactionData.monto}
              onChange={(e) => setTransactionData({ ...transactionData, monto: e.target.value })}
            />
            {transactionSubmitResult && (
              <p>{transactionSubmitResult}</p>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              variant="light"
              onClick={() => setIsTransactionModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              color="primary"
              onClick={handleTransactionSubmit}
              disabled={isSubmittingTransaction || !transactionData.idCuentaDestino || !transactionData.monto}
            >
              {isSubmittingTransaction ? (
                <>
                  <Spinner size="sm" />
                  Procesando...
                </>
              ) : (
                "Enviar Transacción"
              )}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <section className="flex flex-col justify-center gap-4 py-8 px-10">
        <h1 className="font-black text-3xl" >Welcome home {user?.name}</h1>
        <Table aria-label="Example table with dynamic content">
          <TableHeader columns={columns}>
            {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
          </TableHeader>
          <TableBody items={rows}>
            {(item) => (
              <TableRow key={item.key}>
                {(columnKey) => <TableCell>
                  {
                    columnKey === "status" ?
                      <Chip
                        variant="flat"
                        color={"success"}
                      >Active</Chip>
                      : columnKey === "details" ?
                        <Button
                          onClick={async () => {
                            setuseCurrAccount({
                              account: getKeyValue(item, "name"),
                              balance: null,
                              isOpenModal: true,
                              transactions: []
                            })

                            const delay = (ms: number) => new Promise(res => setTimeout(res, ms))

                            await delay(2000)

                            const res = await fetch(apiUrl + "api/getTransactions?idCuenta=" + getKeyValue(item, "name"))
                            //res is a array
                            const data = JSON.parse(await res.text())
                            console.log(data)
                            setuseCurrAccount(e => {
                              return ({
                                ...e,
                                transactions: data
                              })
                            })
                          }}

                          isIconOnly variant="light">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                          </svg>

                        </Button>
                        : getKeyValue(item, columnKey)

                  }
                </TableCell>}
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Loans Table */}
        <h2 className="font-bold text-2xl mt-8">Your Loans</h2>
        <Table aria-label="User loans table">
          <TableHeader>
            <TableColumn>LOAN ID</TableColumn>
            <TableColumn>STATUS</TableColumn>
          </TableHeader>
          <TableBody>
            {loans.map((loan: any) => (
              <TableRow key={loan.idPrestamo}>
                <TableCell>{loan.idPrestamo}</TableCell>
                <TableCell>
                  <Chip
                    variant="flat"
                    color={loan.estado === "al_dia" ? "success" : loan.estado === "pagado" ? "primary" : "danger"}
                  >
                    {loan.estado}
                  </Chip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* New Loan Request Button */}
        <Button
          color="primary"
          onClick={checkLoanViability}
          disabled={isCheckingViability}
        >
          {isCheckingViability ? (
            <>
              <Spinner size="sm" />
              Checking eligibility...
            </>
          ) : (
            "Request New Loan"
          )}
        </Button>

        {/* New Loan Request Modal */}
        <Modal
          isOpen={isLoanModalOpen}
          onClose={() => {
            setIsLoanModalOpen(false);
            setLoanViability(null);
            setLoanAmount("");
            setLoanSubmitResult(null);
          }}
        >
          <ModalContent>
            <ModalHeader>Loan Request</ModalHeader>
            <ModalBody>
              {loanViability === "viable" ? (
                loanSubmitResult ? (
                  <p>{loanSubmitResult}</p>
                ) : (
                  <>
                    <p>You are eligible for a new loan. Please enter the desired loan amount:</p>
                    <Input
                      type="number"
                      label="Loan Amount"
                      placeholder="Enter amount"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(e.target.value)}
                    />
                  </>
                )
              ) : loanViability === "no_viable" ? (
                <p>We're sorry, but you are not eligible for a new loan at this time. Please review your financial situation and try again later.</p>
              ) : (
                <p>There was an error checking your loan eligibility. Please try again later.</p>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onClick={() => {
                setIsLoanModalOpen(false);
                setLoanViability(null);
                setLoanAmount("");
                setLoanSubmitResult(null);
              }}>
                Close
              </Button>
              {loanViability === "viable" && !loanSubmitResult && (
                <Button
                  color="primary"
                  onClick={requestNewLoan}
                  disabled={isSubmittingLoan || !loanAmount}
                >
                  {isSubmittingLoan ? (
                    <>
                      <Spinner size="sm" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Loan Request"
                  )}
                </Button>
              )}
            </ModalFooter>
          </ModalContent>
        </Modal>
      </section>
    </ProtectedLayout>
  );
}
