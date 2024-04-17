# LJ Fluid

In this hands-on guide, we'll use LAMMPS to simulate a mixture of two fluids (binary fluid) and study the phase separation. The fluids are modeled as Lennard-Jones particles confined within a cubic box with continuous boundaries (periodic boundary conditions).  We'll employ a Langevin thermostat to control the temperature, and calculate fundamental properties like potential and kinetic energies. This tutorial serves as a stepping stone, showcasing essential elements of molecular dynamics simulations, including setting up the system, minimizing energy, solving the equations of motion, and visualizing the resulting particle trajectories.

## Introduction to simple LAMMPS script

In order to go through step by step lets consider the simulation framework. Simulation might contains several files. But here we mainly focus on:
  - a) `run.in` -- it cpntains mostly all the informations
  - b) `system.data` -- particles, positions, velocities, bonds, angles, information

`````{admonition} run.in
:class: tip
- **1) Initialization:** units, dimension, atom_style, pair_style boundary _etc._
- **2a) System definition:** either load `system.data` or `create_atoms`
- **2b) Bond and Angle information:** `pair_coeff`, `angle_coeff`, `mass`
- **3) Minimization:** to avoid initial overlaps 
- **4) Visualization:** Check whether particles are in the box _etc._
- **5) Dummy Run:** Initially run for small timesteps _i.e.,_ $\sim 10^5$ 
- **6) Reset time:** `write_data` , `reset_timesteps`
- **7) Final Run:**
`````



`````{admonition} [system.data:](https://shuvo-dip.github.io/MD_Simulation/lj_fluid.html) an example of lammps generated system file
:class: tip
```
LAMMPS data file via write_data, version 3 Mar 2020, timestep = 0

200 atoms
5 atom types
199 bonds
1 bond types
198 angles
1 angle types

0.0000000000000000e+00 5.0000000000000000e+01 xlo xhi
0.0000000000000000e+00 5.0000000000000000e+01 ylo yhi
0.0000000000000000e+00 5.0000000000000000e+01 zlo zhi

Masses

1 1
2 1
3 1
4 1
5 1

Atoms # full

35 1 4 0.0000000000000000e+00 4.6927442356735957e-04 2.5917304644577136e+01 9.2446343214115345e-01 1 0 1
24 1 3 0.0000000000000000e+00 4.4738596798170382e+00 2.7817888523819551e+01 5.6717976560832186e+00 1 0 1
200 1 1 0.0000000000000000e+00 5.9147516604228179e-01 1.8162531643029414e+01 4.7691758446364831e+00 1 0 1
166 1 5 0.0000000000000000e+00 1.4206564943257913e-01 2.5387383075812657e+01 4.9959602477906309e+01 1 0 0
168 1 3 0.0000000000000000e+00 5.9831302455988533e-01 2.7059222183708062e+01 4.9375698118072819e+01 1 0 0
167 
.
.
.
198 1 3 0.0000000000000000e+00 4.9886372673067399e+01 1.9279039503505089e+01 3.3634226785821535e+00 0 0 1
188 1 3 0.0000000000000000e+00 4.9545910789376187e+01 2.5180567455466711e+01 4.8987638671791863e+01 0 0 0
89 1 2 0.0000000000000000e+00 4.9901224571757616e+01 1.5141601528783990e+01 4.6754960184097342e+01 0 0 0
114 1 3 0.0000000000000000e+00 4.9958704483647480e+01 2.1674563605430009e+01 1.3738041526491067e+01 0 0 1

Velocities

35 -8.7770147801311138e-01 1.5101693717367606e+00 6.0446096933556570e-01
24 -9.9424974102245878e-01 1.3375187903264580e+00 2.5207278347123672e+00
200 1.1303805073183029e+00 6.5838908974304966e-01 1.6455895349853347e+00
166 -2.1711562280283929e+00 5.5739576720902884e-01 -2.4101260924931348e-01
168 3.9698835008419225e-02 5.8955871401596471e-01 2.3171435957398314e+00
.
.
.
188 -1.8696257894080665e-01 -1.1207437904225968e+00 -3.9930018404493181e-03
89 2.9740209786705213e-01 7.0494417493173855e-01 7.4736174728733051e-01
114 -4.7738544094380891e-01 5.8646358115481168e-01 -1.3337631131086364e-01


Bonds

1 1 35 36 
2 1 24 25
3 1 166 167
4 1 168 169
5 1 167 168
.
.
198 1 89 90
199 1 114 115

Angles

1 1 34 35 36
2 1 23 24 25
3 1 165 166 167
4 1 167 168 169
.
.
```
`````


### What are these numbers mean?
`````{admonition} [system.data:](https://shuvo-dip.github.io/MD_Simulation/lj_fluid.html) an example of lammps generated system file
:class: tip
```
LAMMPS data file via write_data, version 3 Mar 2020, timestep = 0

200 atoms
5 atom types
199 bonds
1 bond types
198 angles
1 angle types

X_low X_high xlo xhi :box dimension along x
Y_low Y_high ylo yhi :box dimension along y
Z_low Z_high zlo zhi :box dimension along z

Masses

atom_type mass
1 1
2 1

Atoms # full

atom_ID molecular_ID atom_type charge x y z ix iy iz(image in the periodic boundary)  
1 1 1 0 2 3 4 0 0 0
2 1 2 0 3 5 1 0 0 0

Velocities

atom_ID vx vy vz
1 0.5 0.4 0.33

Bonds

ID Bond_type atom1 atom2 (atom1 atom2 are sequentially connected via a bond)
1 1 1 2
2 1 2 3

Angles

ID Angle_type atom1 atom2 atom3 (atom1 atom2 and atom3 are sequentially connected)
1 1 1 2 3
2 1 2 3 4
```

:::{important}
Please make sure you always keep the format fixed
No space between different segements might leads to syntax error
:::

`````


Lets pick an example of LJ fluid. 

`````{admonition} What are the parameters we need to specify 
:class: tip
:::{important}
- a) Numer of particles
- b) Non-bonded interactions
- c) Mass
- d) Bonds, angle, dihedrals etc.
- e) What type of bonds, angles, dihedrals etc. and their corresponding parameters
- f) Boundaries
- g) How long simulation would run 
- h) timesteps, otherwise defult
- i) How frequently dump the configurations
:::
`````


`````{admonition} Method 1: [run.in:](https://shuvo-dip.github.io/MD_Simulation/lj_fluid.html) LAMMPS script for a 10-particle LJ fluid
:class: tip
```

units lj
dimension 3
atom_style full
pair_style lj/cut 1.112
boundary p p p

region          simulation_box block 0 20 0 20 0 20
create_box      1 simulation_box
create_atoms    1 random 10 12345 NULL overlap 2.0 maxtry 50

mass            1 1
pair_coeff      * * 1.0 1.0


thermo          100
thermo_style    custom step temp pe ke etotal press
timestep        0.005
fix             mynve all nve
fix             mylgv all langevin 1.0 1.0 0.1 1530917
run             10000
reset_timestep 0
dump            mydmp all atom 1000 dump.lammpstrj
run             1000000

`````


![movie](abc.gif)

`````{admonition} log file
:class: tip
```
    999100   1.3074207      0              1.765018       1.765018       0.0014708483
    999200   1.4026846      0              1.8936242      1.8936242      0.0015780201
    999300   0.72046866     0              0.9726327      0.9726327      0.00081052725
    999400   0.78655881     0              1.0618544      1.0618544      0.00088487866
    999500   1.0822006      0              1.4609708      1.4609708      0.0012174757
    999600   0.90615892     0              1.2233145      1.2233145      0.0010194288
    999700   0.985891       0              1.3309528      1.3309528      0.0011091274
    999800   1.2901643      0              1.7417218      1.7417218      0.0014514348
    999900   0.67689256     0              0.91380495     0.91380495     0.00076150413
   1000000   0.78634406     0              1.0615645      1.0615645      0.00088463707
Loop time of 19.87 on 8 procs for 1000000 steps with 10 atoms

Performance: 21741277.904 tau/day, 50327.032 timesteps/s, 503.270 katom-step/s
80.1% CPU use with 8 MPI tasks x no OpenMP threads

MPI task timing breakdown:
Section |  min time  |  avg time  |  max time  |%varavg| %total
---------------------------------------------------------------
Pair    | 0.054741   | 0.057883   | 0.064233   |   1.2 |  0.29
Bond    | 0.04021    | 0.042227   | 0.044459   |   0.8 |  0.21
Neigh   | 0.34606    | 0.35955    | 0.37062    |   1.3 |  1.81
Comm    | 7.498      | 8.0589     | 8.8711     |  16.4 | 40.56
Output  | 0.57603    | 0.61785    | 0.73808    |   6.0 |  3.11
Modify  | 0.16301    | 0.17659    | 0.1904     |   2.4 |  0.89
Other   |            | 10.56      |            |       | 53.13

Nlocal:           1.25 ave           4 max           0 min
Histogram: 4 0 1 0 0 1 0 1 0 1
Nghost:          2.125 ave           4 max           0 min
Histogram: 2 0 0 0 0 2 0 3 0 1
Neighs:              0 ave           0 max           0 min
Histogram: 8 0 0 0 0 0 0 0 0 0

Total # of neighbors = 0
Ave neighs/atom = 0
Ave special neighs/atom = 0
Neighbor list builds = 78413
Dangerous builds = 0
Total wall time: 0:00:20
`````





`````{admonition} Method 2: [run.in:](https://shuvo-dip.github.io/MD_Simulation/lj_fluid.html) LAMMPS script read_data from *system_specific.data* file
:class: tip
```
units lj
dimension 3
atom_style full
pair_style lj/cut 1.112
boundary p p p

read_data        system_box.data

pair_coeff      * * 1.0 1.0


thermo          100
thermo_style    custom step temp pe ke etotal press
timestep        0.005
fix             mynve all nve
fix             mylgv all langevin 1.0 1.0 0.1 1530917
run             10000
reset_timestep 0
thermo          1000
dump            mydmp all atom 1000 dump.lammpstrj
run             1000000

`````


`````{admonition} Method 2: [system_box.data:](https://shuvo-dip.github.io/MD_Simulation/lj_fluid.html) LAMMPS script *system_box.data* file
:class: tip
```
LAMMPS data file via write_data, version 3 Mar 2020, timestep = 20000000

10 atoms
1 atom types

0 10 xlo xhi
0 10 ylo yhi
0 10 zlo zhi

Masses

1 1

Atoms # full

1 1 1 0 1 1 1
2 1 1 0 2 2 2
3 1 1 0 3 1 1
4 1 1 0 4 2 2
5 1 1 0 5 1 1
6 1 1 0 6 2 2
7 1 1 0 7 1 1
8 1 1 0 8 2 2
9 1 1 0 9 1 1
10 1 1 0 1 5 2


`````


![movie](abc.gif)
