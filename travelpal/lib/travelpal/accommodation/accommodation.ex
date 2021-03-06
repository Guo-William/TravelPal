defmodule Travelpal.Accommodation do
  @moduledoc """
  The Accommodation context.
  """

  import Ecto.Query, warn: false
  alias Travelpal.Repo

  alias Travelpal.Accommodation.Hotel

  @doc """
  Returns the list of hotels.

  ## Examples

      iex> list_hotels()
      [%Hotel{}, ...]

  """
  def list_hotels do
    Repo.all(from h in Hotel,
      order_by: [asc: :name])
  end

  def list_hotels_by_location(location) do
    query = from h in Hotel,
            where: h.result_from == ^(location)
    Repo.all(query)
  end

  @doc """
  Gets a single hotel.

  Raises `Ecto.NoResultsError` if the Hotel does not exist.

  ## Examples

      iex> get_hotel!(123)
      %Hotel{}

      iex> get_hotel!(456)
      ** (Ecto.NoResultsError)

  """
  def get_hotel!(id), do: Repo.get!(Hotel, id)

  @doc """
  Creates a hotel.

  ## Examples

      iex> create_hotel(%{field: value})
      {:ok, %Hotel{}}

      iex> create_hotel(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_hotel(attrs \\ %{}) do
    %Hotel{}
    |> Hotel.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a hotel.

  ## Examples

      iex> update_hotel(hotel, %{field: new_value})
      {:ok, %Hotel{}}

      iex> update_hotel(hotel, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_hotel(%Hotel{} = hotel, attrs) do
    hotel
    |> Hotel.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a Hotel.

  ## Examples

      iex> delete_hotel(hotel)
      {:ok, %Hotel{}}

      iex> delete_hotel(hotel)
      {:error, %Ecto.Changeset{}}

  """
  def delete_hotel(%Hotel{} = hotel) do
    Repo.delete(hotel)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking hotel changes.

  ## Examples

      iex> change_hotel(hotel)
      %Ecto.Changeset{source: %Hotel{}}

  """
  def change_hotel(%Hotel{} = hotel) do
    Hotel.changeset(hotel, %{})
  end
end
